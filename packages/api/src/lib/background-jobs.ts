import { prisma } from '../lib/prisma'
import { getTransactionStatus } from '../lib/solana'
import crypto from 'crypto'

/**
 * Background Job: Monitor pending transactions and deliver webhooks
 *
 * This job should be run periodically (every 5-10 seconds) to:
 * 1. Check status of pending transactions on Solana
 * 2. Update payment status when confirmed/failed
 * 3. Deliver webhooks to merchants when payment confirmed
 * 4. Retry failed webhooks with exponential backoff
 */

interface TransactionMonitorResult {
  processed: number
  confirmed: number
  failed: number
  errors: string[]
}

export async function monitorPendingTransactions(): Promise<TransactionMonitorResult> {
  const result: TransactionMonitorResult = {
    processed: 0,
    confirmed: 0,
    failed: 0,
    errors: [],
  }

  try {
    // Get all pending payments with Solana signatures
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: 'pending',
        solanaSignature: {
          not: null,
        },
      },
      include: {
        merchant: true,
      },
    })

    console.log(`📊 Monitoring ${pendingPayments.length} pending payments...`)

    for (const payment of pendingPayments) {
      result.processed++

      try {
        if (!payment.solanaSignature) continue

        // Check transaction status on Solana
        const txStatus = await getTransactionStatus(payment.solanaSignature)

        if (txStatus === 'confirmed') {
          // Update payment status
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'confirmed',
              confirmedAt: new Date(),
            },
          })

          result.confirmed++
          console.log(`✅ Payment ${payment.id} confirmed`)

          // Deliver webhook to merchant
          if (payment.merchant?.webhookUrl) {
            await deliverWebhook(payment, 'confirmed')
          }
        } else if (txStatus === 'failed') {
          // Update payment status
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'failed',
            },
          })

          result.failed++
          console.log(`❌ Payment ${payment.id} failed on blockchain`)

          // Deliver webhook to merchant
          if (payment.merchant?.webhookUrl) {
            await deliverWebhook(payment, 'failed')
          }
        }
        // else: still pending, check again next cycle
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        result.errors.push(`Payment ${payment.id}: ${errorMsg}`)
        console.error(`Error processing payment ${payment.id}:`, error)
      }
    }

    console.log(`✨ Transaction monitor complete: ${result.confirmed} confirmed, ${result.failed} failed`)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    result.errors.push(`Monitor error: ${errorMsg}`)
    console.error('Error in transaction monitor:', error)
  }

  return result
}

/**
 * Retry failed webhooks with exponential backoff
 * Retries up to 5 times with delays: 1m, 5m, 30m, 2h, 24h
 */
export async function retryFailedWebhooks(): Promise<{
  retried: number
  delivered: number
  errors: string[]
}> {
  const result: { retried: number; delivered: number; errors: string[] } = { retried: 0, delivered: 0, errors: [] }

  try {
    const now = new Date()

    // Get webhook logs that are pending and due for retry
    const failedLogs = await prisma.webhookLog.findMany({
      where: {
        status: 'pending',
        nextRetry: {
          lte: now,
        },
        retryCount: {
          lt: 5, // Max 5 retries
        },
      },
      include: {
        payment: {
          include: {
            merchant: true,
          },
        },
      },
    })

    console.log(`🔄 Retrying ${failedLogs.length} failed webhooks...`)

    for (const log of failedLogs) {
      result.retried++

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const payloadStr = typeof log.payload === 'string' ? log.payload : JSON.stringify(log.payload)

        const response = await fetch(log.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': log.signature,
          },
          body: payloadStr,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          // Success
          await prisma.webhookLog.update({
            where: { id: log.id },
            data: {
              status: 'delivered',
              response: await response.text(),
            },
          })
          result.delivered++
          console.log(`✅ Webhook ${log.id} delivered on retry ${log.retryCount + 1}`)
        } else {
          // Retry needed
          const nextDelay = getExponentialBackoffDelay(log.retryCount + 1)
          const nextRetry = new Date(now.getTime() + nextDelay)

          await prisma.webhookLog.update({
            where: { id: log.id },
            data: {
              retryCount: log.retryCount + 1,
              nextRetry,
              response: await response.text(),
            },
          })
          console.log(`⏳ Webhook ${log.id} retry scheduled for ${nextRetry.toISOString()}`)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        result.errors.push(`Webhook ${log.id}: ${errorMsg}`)

        // Schedule next retry
        const nextDelay = getExponentialBackoffDelay(log.retryCount + 1)
        const nextRetry = new Date(now.getTime() + nextDelay)

        await prisma.webhookLog.update({
          where: { id: log.id },
          data: {
            retryCount: log.retryCount + 1,
            nextRetry,
            response: errorMsg,
          },
        })
      }
    }

    console.log(`✨ Webhook retry complete: ${result.delivered} delivered, ${result.retried - result.delivered} rescheduled`)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    result.errors.push(`Retry error: ${errorMsg}`)
    console.error('Error in webhook retry:', error)
  }

  return result
}

/**
 * Deliver webhook to merchant
 */
async function deliverWebhook(
  payment: any,
  status: 'confirmed' | 'failed'
): Promise<void> {
  try {
    if (!payment.merchant?.webhookUrl || !payment.merchant?.webhookSecret) {
      console.warn(`No webhook configured for merchant ${payment.merchantId}`)
      return
    }

    // Create webhook payload
    const payload = {
      event: 'payment.updated',
      data: {
        paymentId: payment.id,
        merchantId: payment.merchantId,
        amount: payment.amount.toString(),
        token: payment.token,
        status: status,
        solanaSignature: payment.solanaSignature,
        confirmedAt: status === 'confirmed' ? payment.confirmedAt : null,
        metadata: payment.metadata,
        timestamp: new Date().toISOString(),
      },
    }

    const payloadStr = JSON.stringify(payload)

    // Sign webhook with HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', payment.merchant.webhookSecret)
      .update(payloadStr)
      .digest('hex')

    // Attempt to deliver with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(payment.merchant.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
      },
      body: payloadStr,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const responseText = await response.text()

    // Log webhook attempt
    await prisma.webhookLog.create({
      data: {
        paymentId: payment.id,
        merchantId: payment.merchantId,
        url: payment.merchant.webhookUrl,
        payload: payloadStr,
        response: responseText,
        status: response.ok ? 'delivered' : 'pending',
        signature,
        retryCount: response.ok ? 0 : 1,
        nextRetry: response.ok ? null : new Date(Date.now() + 60000), // Retry in 1 minute
      },
    })

    if (response.ok) {
      console.log(`✅ Webhook delivered for payment ${payment.id}`)
    } else {
      console.warn(`⚠️ Webhook delivery failed for payment ${payment.id}: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error delivering webhook for payment ${payment.id}:`, error)

    // Log failed attempt
    try {
      await prisma.webhookLog.create({
        data: {
          paymentId: payment.id,
          merchantId: payment.merchantId,
          url: payment.merchant?.webhookUrl || 'unknown',
          payload: JSON.stringify(payment),
          response: error instanceof Error ? error.message : String(error),
          status: 'pending',
          signature: '',
          retryCount: 1,
          nextRetry: new Date(Date.now() + 60000),
        },
      })
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }
  }
}

/**
 * Get exponential backoff delay in milliseconds
 * Retry schedule: 1m, 5m, 30m, 2h, 24h
 */
function getExponentialBackoffDelay(retryCount: number): number {
  const delays = [
    60 * 1000, // 1 minute
    5 * 60 * 1000, // 5 minutes
    30 * 60 * 1000, // 30 minutes
    2 * 60 * 60 * 1000, // 2 hours
    24 * 60 * 60 * 1000, // 24 hours
  ]
  return delays[Math.min(retryCount - 1, delays.length - 1)]
}

/**
 * Run all background jobs
 * Call this periodically (every 5-10 seconds) from a cron job or background queue
 */
export async function runBackgroundJobs(): Promise<void> {
  console.log(`[${new Date().toISOString()}] 🚀 Running background jobs...`)

  const txResult = await monitorPendingTransactions()
  const webhookResult = await retryFailedWebhooks()

  console.log(`[${new Date().toISOString()}] ✨ Background jobs complete`)
  console.log(`   - TX Monitoring: ${txResult.confirmed} confirmed, ${txResult.failed} failed`)
  console.log(`   - Webhook Retries: ${webhookResult.delivered} delivered, ${webhookResult.retried - webhookResult.delivered} rescheduled`)

  if (txResult.errors.length > 0 || webhookResult.errors.length > 0) {
    console.error('Errors during background jobs:', [...txResult.errors, ...webhookResult.errors])
  }
}
