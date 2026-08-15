import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  statusCode = 200
) {
  res.status(statusCode).json({
    success: true,
    data,
  })
}

/**
 * Send error response
 */
export function sendError(
  res: NextApiResponse,
  message: string,
  code = 'UNKNOWN_ERROR',
  statusCode = 400
) {
  res.status(statusCode).json({
    success: false,
    error: message,
    code,
  })
}

/**
 * Handle API errors uniformly
 */
export function handleApiError(
  res: NextApiResponse,
  error: unknown,
  statusCode = 500
) {
  console.error('API Error:', error)

  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 'NOT_FOUND', 404)
    }
    if (error.message.includes('unauthorized')) {
      return sendError(res, error.message, 'UNAUTHORIZED', 401)
    }
  }

  sendError(
    res,
    'Internal server error',
    'INTERNAL_ERROR',
    statusCode
  )
}

/**
 * Validate required fields in request body
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[]
): string | null {
  for (const field of fields) {
    if (!data[field]) {
      return `Missing required field: ${field}`
    }
  }
  return null
}


  