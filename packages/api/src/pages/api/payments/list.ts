import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../middleware/auth'
import { sendSuccess, sendError } from '../../../lib/api-response'
import { withMethod } from '../../../middleware/validation'

/**
 * GET /api/payments?limit=10&offset=0&status=pending
 * List merchant's payments with optional filtering
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['GET'])) return

  try {
    const merchant = (req as any).merchant
    const { limit = '10', offset = '0', status } = req.query

    const limitNum = Math.min(parseInt(limit as string) || 10, 100)
    const offsetNum = parseInt(offset as string) || 0

    // Build filter
    const where: any = { merchantId: merchant.id }
    if (status) where.status = status

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limitNum,
        skip: offsetNum,
      }),
      prisma.payment.count({ where }),
    ])

    return sendSuccess(res, {
      payments: payments.map((p: any) => ({
        id: p.id,
        amount: p.amount,
        token: p.token,
        status: p.status,
        solanaSignature: p.solanaSignature,
        createdAt: p.createdAt,
        confirmedAt: p.confirmedAt,
      })),
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
      },
    })
  } catch (error) {
    console.error('List payments error:', error)
    return sendError(res, 'Failed to fetch payments', 'FETCH_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
