import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'
import { sendSuccess, sendError } from '@/lib/api-response'
import { withMethod } from '@/middleware/validation'

/**
 * GET /api/dashboard/stats
 * Get merchant dashboard statistics
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['GET'])) return

  try {
    const merchant = (req as any).merchant

    // Get payment stats
    const allPayments = await prisma.payment.findMany({
      where: { merchantId: merchant.id },
    })

    const confirmedPayments = allPayments.filter(p => p.status === 'confirmed')
    const pendingPayments = allPayments.filter(p => p.status === 'pending')
    const failedPayments = allPayments.filter(p => p.status === 'failed')

    const totalVolume = confirmedPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)
    const totalTransactions = confirmedPayments.length
    const averageTransaction = totalTransactions > 0 ? totalVolume / totalTransactions : 0

    // Get today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayPayments = confirmedPayments.filter(p => p.confirmedAt && p.confirmedAt >= today)
    const todayVolume = todayPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)

    return sendSuccess(res, {
      totalVolume: parseFloat(totalVolume.toFixed(8)),
      totalTransactions,
      averageTransaction: parseFloat(averageTransaction.toFixed(8)),
      pendingPayments: pendingPayments.length,
      failedPayments: failedPayments.length,
      successRate: totalTransactions > 0 ? ((totalTransactions / allPayments.length) * 100).toFixed(2) : '0',
      todayVolume: parseFloat(todayVolume.toFixed(8)),
      todayTransactions: todayPayments.length,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return sendError(res, 'Failed to fetch stats', 'FETCH_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
