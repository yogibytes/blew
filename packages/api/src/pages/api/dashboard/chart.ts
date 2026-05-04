import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../middleware/auth'
import { sendSuccess, sendError } from '../../../lib/api-response'
import { withMethod } from '../../../middleware/validation'
import type { Payment } from '@prisma/client'

/**
 * GET /api/dashboard/chart?range=7days
 * Get payment volume chart data (for graphs)
 * Ranges: 7days, 30days, 90days, all
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!withMethod(req, res, ['GET'])) return

  try {
    const merchant = (req as any).merchant
    const { range = '7days' } = req.query

    // Calculate date range
    let daysBack = 7
    if (range === '30days') daysBack = 30
    if (range === '90days') daysBack = 90

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    startDate.setHours(0, 0, 0, 0)

    // Get confirmed payments in range
    const payments = await prisma.payment.findMany({
      where: {
        merchantId: merchant.id,
        status: 'confirmed',
        confirmedAt: { gte: startDate },
      },
      orderBy: { confirmedAt: 'asc' },
    })

    // Group by day
    const chartData: Record<string, { date: string; volume: number; transactions: number }> = {}

    for (let i = daysBack; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const dateStr = date.toISOString().split('T')[0]

      chartData[dateStr] = {
        date: dateStr,
        volume: 0,
        transactions: 0,
      }
    }

    // Aggregate payments by date
    payments.forEach((payment: Payment) => {
      if (payment.confirmedAt) {
        const dateStr = payment.confirmedAt.toISOString().split('T')[0]
        if (chartData[dateStr]) {
          chartData[dateStr].volume += parseFloat(payment.amount.toString())
          chartData[dateStr].transactions += 1
        }
      }
    })

    const data = Object.values(chartData)

    return sendSuccess(res, {
      range,
      data: data.map(item => ({
        ...item,
        volume: parseFloat(item.volume.toFixed(8)),
      })),
    })
  } catch (error) {
    console.error('Dashboard chart error:', error)
    return sendError(res, 'Failed to fetch chart data', 'FETCH_ERROR', 500)
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  withAuth(req, res, handler)
