import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'
import { sendSuccess, sendError } from '@/lib/api-response'
import { withMethod } from '@/middleware/validation'

/**
 * GET /api/payments/[id]
 * Get payment details
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['GET'])) return

  try {
    const merchant = (req as any).merchant
    const { id } = req.query

    const payment = await prisma.payment.findFirst({
      where: {
        id: id as string,
        merchantId: merchant.id,
      },
    })

    if (!payment) {
      return sendError(res, 'Payment not found', 'NOT_FOUND', 404)
    }

    return sendSuccess(res, {
      id: payment.id,
      amount: payment.amount,
      token: payment.token,
      currency: payment.currency,
      status: payment.status,
      solanaSignature: payment.solanaSignature,
      customerWallet: payment.customerWallet,
      metadata: payment.metadata,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt,
      confirmedAt: payment.confirmedAt,
    })
  } catch (error) {
    console.error('Get payment error:', error)
    return sendError(res, 'Failed to fetch payment', 'FETCH_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
