import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { generateWebhookSecret } from '../../../lib/crypto'
import { withAuth } from '../../../middleware/auth'
import { sendSuccess, sendError, validateRequired } from '../../../lib/api-response'
import { withMethod, ensureBodyJson } from '../../../middleware/validation'

/**
 * PUT /api/merchants/update
 * Update merchant webhook settings
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['PUT'])) return
  if (!ensureBodyJson(req, res)) return

  try {
    const merchant = (req as any).merchant
    const { webhookUrl } = req.body

    if (!webhookUrl) {
      return sendError(res, 'Missing webhookUrl', 'VALIDATION_ERROR', 400)
    }

    // Generate new webhook secret if updating URL
    const webhookSecret = generateWebhookSecret()

    const updated = await prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        webhookUrl,
        webhookSecret,
      },
    })

    return sendSuccess(res, {
      id: updated.id,
      webhookUrl: updated.webhookUrl,
      webhookSecret: updated.webhookSecret,
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    console.error('Update merchant error:', error)
    return sendError(res, 'Failed to update merchant', 'UPDATE_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
