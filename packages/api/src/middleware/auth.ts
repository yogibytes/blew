import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../lib/prisma'
import { sendError } from '../lib/api-response'

/**
 * Middleware to authenticate API requests using API key
 * Adds merchant to req object
 */
export async function withAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: any, res: NextApiResponse) => Promise<void>
) {
  try {
    const apiKey = req.headers['x-api-key'] as string

    if (!apiKey) {
      return sendError(
        res,
        'Missing API key header: X-API-Key',
        'MISSING_API_KEY',
        401
      )
    }

    // Find merchant by API key
    const merchant = await prisma.merchant.findUnique({
      where: { apiKey },
    })

    if (!merchant) {
      return sendError(res, 'Invalid API key', 'INVALID_API_KEY', 401)
    }

    if (merchant.status !== 'active') {
      return sendError(res, 'Merchant account inactive', 'MERCHANT_INACTIVE', 403)
    }

    // Attach merchant to request
    ;(req as any).merchant = merchant

    // Call the actual handler
    return handler(req, res)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return sendError(res, 'Authentication failed', 'AUTH_ERROR', 500)
  }
}

/**
 * Middleware for public endpoints (no auth required)
 */
export async function withPublic(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return handler(req, res)
}
