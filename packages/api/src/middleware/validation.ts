import { NextApiRequest, NextApiResponse } from 'next'
import { sendError } from '../lib/api-response'

/**
 * Middleware to ensure only allowed HTTP methods
 */
export function withMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!req.method || !allowedMethods.includes(req.method)) {
    sendError(
      res,
      `Method ${req.method} not allowed. Allowed: ${allowedMethods.join(', ')}`,
      'METHOD_NOT_ALLOWED',
      405
    )
    return false
  }
  return true
}

/**
 * Middleware to validate request body is JSON
 */
export function ensureBodyJson(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  if (req.method === 'GET' || req.method === 'DELETE') {
    return true
  }

  const contentType = req.headers['content-type']
  if (!contentType?.includes('application/json')) {
    sendError(
      res,
      'Content-Type must be application/json',
      'INVALID_CONTENT_TYPE',
      400
    )
    return false
  }

  return true
}
