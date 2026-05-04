import { NextApiRequest, NextApiResponse } from 'next'
import { runBackgroundJobs } from '../../../lib/background-jobs'
import { sendSuccess, sendError } from '../../../lib/api-response'
import { withMethod } from '../../../middleware/validation'

/**
 * POST /api/cron/background-jobs
 *
 * Trigger background jobs (TX monitoring and webhook delivery)
 * This endpoint should be called by a cron service (EasyCron, AWS EventBridge, etc.)
 * every 5-10 seconds
 *
 * Authentication: Simple Bearer token in Authorization header
 * Set CRON_SECRET env var to a random string
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['POST'])) return

  try {
    // Verify cron secret
    const cronSecret = process.env.CRON_SECRET
    if (!cronSecret) {
      return sendError(res, 'CRON_SECRET not configured', 'CONFIG_ERROR', 500)
    }

    const authHeader = req.headers.authorization || ''
    const token = authHeader.replace('Bearer ', '')

    if (token !== cronSecret) {
      return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401)
    }

    // Run background jobs
    await runBackgroundJobs()

    return sendSuccess(res, {
      message: 'Background jobs completed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in background job endpoint:', error)
    return sendError(
      res,
      error instanceof Error ? error.message : 'Failed to run background jobs',
      'BACKGROUND_JOB_ERROR',
      500
    )
  }
}

export default handler
