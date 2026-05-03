import crypto from 'crypto'

/**
 * Generate a secure API key for merchants
 */
export function generateApiKey(): string {
  return 'blew_' + crypto.randomBytes(32).toString('hex')
}

/**
 * Generate a webhook secret for HMAC signing
 */
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Verify webhook signature using HMAC-SHA256
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Generate a cryptographically secure random ID
 */
export function generateId(): string {
  return crypto.randomBytes(12).toString('hex')
}
