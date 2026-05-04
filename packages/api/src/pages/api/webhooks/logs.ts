import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../middleware/auth'
import { sendSuccess, sendError } from '../../../lib/api-response'
import { withMethod } from '../../../middleware/validation'

/**
 * GET /api/webhooks/logs?limit=50&offset=0&status=failed
 * Get webhook delivery logs for merchant
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['GET'])) return

  try {
    const merchant = (req as any).merchant
    const { limit = '50', offset = '0', status, paymentId } = req.query

    const limitNum = Math.min(parseInt(limit as string) || 50, 500)
    const offsetNum = parseInt(offset as string) || 0

    // Build filter
    const where: any = { merchantId: merchant.id }
    if (status) where.status = status
    if (paymentId) where.paymentId = paymentId

    const [logs, total] = await Promise.all([
      prisma.webhookLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limitNum,
        skip: offsetNum,
      }),
      prisma.webhookLog.count({ where }),
    ])

    return sendSuccess(res, {
      logs: logs.map((log: any) => ({
        id: log.id,
        paymentId: log.paymentId,
        url: log.url,
        status: log.status,
        retryCount: log.retryCount,
        maxRetries: log.maxRetries,
        errorMessage: log.errorMessage,
        createdAt: log.createdAt,
        lastAttemptAt: log.lastAttemptAt,
        nextRetry: log.nextRetry,
      })),
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
      },
    })
  } catch (error) {
    console.error('Fetch webhook logs error:', error)
    return sendError(res, 'Failed to fetch logs', 'FETCH_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
