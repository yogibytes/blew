import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../middleware/auth'
import { sendSuccess, sendError, validateRequired } from '../../../lib/api-response'
import { withMethod, ensureBodyJson } from '../../../middleware/validation'
import {withCors} from '../../../middleware/cors'

/**
 * POST /api/payments
 * Create a new payment request
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['POST'])) return
  if (!ensureBodyJson(req, res)) return

  try {
    const merchant = (req as any).merchant
    const { amount, token = 'SOL', currency = 'USD', metadata } = req.body

    // Validate required fields
    const error = validateRequired(req.body, ['amount'])
    if (error) return sendError(res, error, 'VALIDATION_ERROR', 400)

    // Validate amount is positive number
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return sendError(res, 'Amount must be a positive number', 'INVALID_AMOUNT', 400)
    }

    // Create payment (expires in 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    const payment = await prisma.payment.create({
      data: {
        merchantId: merchant.id,
        amount: amountNum,
        token,
        currency,
        status: 'pending',
        metadata,
        expiresAt,
      },
    })

    return sendSuccess(res, {
      paymentId: payment.id,
      amount: payment.amount,
      token: payment.token,
      status: payment.status,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt,
    }, 201)
  } catch (error) {
    console.error('Create payment error:', error)
    return sendError(res, 'Failed to create payment', 'PAYMENT_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
withCors(req, res, (req, res) => withAuth(req, res, handler))
