import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { generateApiKey, generateWebhookSecret } from '@/lib/crypto'
import { sendSuccess, sendError, validateRequired } from '@/lib/api-response'
import { withMethod, ensureBodyJson } from '@/middleware/validation'

/**
 * POST /api/merchants/register
 * Register a new merchant account
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!withMethod(req, res, ['POST'])) return
  if (!ensureBodyJson(req, res)) return

  try {
    const { name, email, walletAddress, webhookUrl } = req.body

    // Validate required fields
    const error = validateRequired(req.body, ['name', 'email', 'walletAddress'])
    if (error) return sendError(res, error, 'VALIDATION_ERROR', 400)

    // Check if email already exists
    const existingMerchant = await prisma.merchant.findUnique({
      where: { email },
    })
    if (existingMerchant) {
      return sendError(res, 'Email already registered', 'EMAIL_EXISTS', 409)
    }

    // Check if wallet already exists
    const existingWallet = await prisma.merchant.findUnique({
      where: { walletAddress },
    })
    if (existingWallet) {
      return sendError(res, 'Wallet already registered', 'WALLET_EXISTS', 409)
    }

    // Generate API key and webhook secret
    const apiKey = generateApiKey()
    const webhookSecret = webhookUrl ? generateWebhookSecret() : undefined

    // Create merchant
    const merchant = await prisma.merchant.create({
      data: {
        name,
        email,
        walletAddress,
        apiKey,
        webhookUrl: webhookUrl || undefined,
        webhookSecret,
        status: 'active',
      },
    })

    return sendSuccess(res, {
      id: merchant.id,
      email: merchant.email,
      name: merchant.name,
      walletAddress: merchant.walletAddress,
      apiKey: merchant.apiKey,
      webhookSecret: merchant.webhookSecret,
      status: merchant.status,
      createdAt: merchant.createdAt,
    }, 201)
  } catch (error) {
    console.error('Register error:', error)
    return sendError(res, 'Failed to register merchant', 'REGISTRATION_ERROR', 500)
  }
}
