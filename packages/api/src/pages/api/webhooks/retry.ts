import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'
import { sendSuccess, sendError, validateRequired } from '@/lib/api-response'
import { withMethod, ensureBodyJson } from '@/middleware/validation'

/**
 * POST /api/webhooks/retry
 * Manually retry failed webhook deliveries
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['POST'])) return
  if (!ensureBodyJson(req, res)) return

  try {
    const merchant = (req as any).merchant
    const { logId } = req.body

    // Validate required fields
    const error = validateRequired(req.body, ['logId'])
    if (error) return sendError(res, error, 'VALIDATION_ERROR', 400)

    // Find webhook log
    const log = await prisma.webhookLog.findFirst({
      where: {
        id: logId,
        merchantId: merchant.id,
      },
    })

    if (!log) {
      return sendError(res, 'Webhook log not found', 'NOT_FOUND', 404)
    }

    if (log.retryCount >= log.maxRetries) {
      return sendError(
        res,
        'Max retries exceeded. Cannot retry.',
        'MAX_RETRIES_EXCEEDED',
        400
      )
    }

    // Reset for retry (next background job will pick it up)
    const updated = await prisma.webhookLog.update({
      where: { id: logId },
      data: {
        status: 'pending',
        nextRetry: new Date(), // Immediate retry
        retryCount: log.retryCount + 1,
      },
    })

    return sendSuccess(res, {
      id: updated.id,
      status: updated.status,
      retryCount: updated.retryCount,
      nextRetry: updated.nextRetry,
    })
  } catch (error) {
    console.error('Retry webhook error:', error)
    return sendError(res, 'Failed to retry webhook', 'RETRY_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
