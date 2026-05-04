import { NextApiRequest, NextApiResponse } from 'next'
import { withAuth } from '../../../middleware/auth'
import { sendSuccess, sendError } from '../../../lib/api-response'
import { withMethod } from '../../../middleware/validation'

/**
 * GET /api/merchants/me
 * Get authenticated merchant's profile
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['GET'])) return

  try {
    const merchant = (req as any).merchant

    return sendSuccess(res, {
      id: merchant.id,
      email: merchant.email,
      name: merchant.name,
      walletAddress: merchant.walletAddress,
      webhookUrl: merchant.webhookUrl,
      status: merchant.status,
      totalVolume: merchant.totalVolume,
      transactionCount: merchant.transactionCount,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
    })
  } catch (error) {
    console.error('Get merchant error:', error)
    return sendError(res, 'Failed to fetch merchant', 'FETCH_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
