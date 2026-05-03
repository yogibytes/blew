import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'
import { sendSuccess, sendError, validateRequired } from '@/lib/api-response'
import { withMethod, ensureBodyJson } from '@/middleware/validation'

/**
 * POST /api/payments/[id]/confirm
 * Confirm payment after transaction signed
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['POST'])) return
  if (!ensureBodyJson(req, res)) return

  try {
    const merchant = (req as any).merchant
    const { id } = req.query
    const { signature, customerWallet } = req.body

    // Validate required fields
    const error = validateRequired(req.body, ['signature'])
    if (error) return sendError(res, error, 'VALIDATION_ERROR', 400)

    // Find payment
    const payment = await prisma.payment.findFirst({
      where: {
        id: id as string,
        merchantId: merchant.id,
      },
    })

    if (!payment) {
      return sendError(res, 'Payment not found', 'NOT_FOUND', 404)
    }

    if (payment.status !== 'pending') {
      return sendError(res, 'Payment already confirmed or expired', 'INVALID_STATUS', 400)
    }

    // Check if signature already exists (idempotency)
    const existingPayment = await prisma.payment.findUnique({
      where: { solanaSignature: signature },
    })

    if (existingPayment && existingPayment.id !== payment.id) {
      return sendError(res, 'Signature already used', 'DUPLICATE_SIGNATURE', 409)
    }

    // Update payment status
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'confirmed',
        solanaSignature: signature,
        customerWallet: customerWallet || payment.customerWallet,
        confirmedAt: new Date(),
      },
    })

    // TODO: Trigger webhook delivery here
    // TODO: Update merchant's total volume and transaction count

    return sendSuccess(res, {
      id: updated.id,
      status: updated.status,
      solanaSignature: updated.solanaSignature,
      confirmedAt: updated.confirmedAt,
    })
  } catch (error) {
    console.error('Confirm payment error:', error)
    return sendError(res, 'Failed to confirm payment', 'CONFIRM_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
