'use client'

import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { Header } from '../components/Header'
import { Card, StatCard, Table, Badge } from '../components/UI'

interface DashboardStats {
  totalVolume: number
  totalTransactions: number
  averageTransaction: number
  pendingPayments: number
  failedPayments: number
  successRate: number
  todayVolume: number
  todayTransactions: number
}

interface ChartData {
  date: string
  volume: number
  transactions: number
}

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'confirmed' | 'failed'
  token: string
  createdAt: string
}

const DashboardContent: React.FC = () => {
  const { themeConfig } = useTheme()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<'7days' | '30days' | '90days'>('7days')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    if (!mounted) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get API key from localStorage (set during merchant registration)
        const apiKey = localStorage.getItem('blew-api-key')
        if (!apiKey) {
          setError('No API key found. Please register as a merchant first.')
          setLoading(false)
          return
        }

        // Fetch stats
        const statsRes = await fetch('/api/dashboard/stats', {
          headers: { 'X-API-Key': apiKey },
        })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.data)
        }

        // Fetch chart data
        const chartRes = await fetch(`/api/dashboard/chart?range=${range}`, {
          headers: { 'X-API-Key': apiKey },
        })
        if (chartRes.ok) {
          const chart = await chartRes.json()
          setChartData(chart.data || [])
        }

        // Fetch recent payments
        const paymentsRes = await fetch('/api/payments?limit=5&offset=0', {
          headers: { 'X-API-Key': apiKey },
        })
        if (paymentsRes.ok) {
          const payments = await paymentsRes.json()
          setRecentPayments(payments.data?.payments || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [range, mounted])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge text="Confirmed" variant="success" />
      case 'failed':
        return <Badge text="Failed" variant="failed" />
      default:
        return <Badge text="Pending" variant="pending" />
    }
  }

  if (!mounted) {
    return null
  }

  if (loading && !stats) {
    return (
      <div
        style={{ backgroundColor: themeConfig.bg.primary }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <div
            style={{ color: themeConfig.accent.primary }}
            className="text-4xl mb-4 animate-spin"
          >
            🌬️
          </div>
          <p style={{ color: themeConfig.text.secondary }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: themeConfig.bg.primary, color: themeConfig.text.primary }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div
            style={{
              backgroundColor: themeConfig.accent.danger + '20',
              borderColor: themeConfig.accent.danger,
              color: themeConfig.accent.danger,
            }}
            className="mb-6 border rounded-lg p-4"
          >
            {error}
          </div>
        )}

        {/* Stats Grid - Responsive: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            label="Total Volume"
            value={`${stats?.totalVolume.toFixed(2) || 0} SOL`}
            icon="💰"
            accentColor="primary"
            change={stats ? Math.floor(Math.random() * 40 - 20) : 0}
          />
          <StatCard
            label="Transactions"
            value={stats?.totalTransactions || 0}
            icon="📊"
            accentColor="primary"
            change={stats ? Math.floor(Math.random() * 30 - 10) : 0}
          />
          <StatCard
            label="Success Rate"
            value={`${stats?.successRate.toFixed(1) || 0}%`}
            icon="✅"
            accentColor="success"
            change={stats ? Math.floor(Math.random() * 20 - 5) : 0}
          />
          <StatCard
            label="Avg Transaction"
            value={`${stats?.averageTransaction.toFixed(3) || 0} SOL`}
            icon="📈"
            accentColor="primary"
          />
        </div>

        {/* Quick Stats - Responsive: 1 col → 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <StatCard
            label="Pending Payments"
            value={stats?.pendingPayments || 0}
            icon="⏳"
            accentColor="warning"
          />
          <StatCard
            label="Failed Payments"
            value={stats?.failedPayments || 0}
            icon="❌"
            accentColor="danger"
          />
        </div>

        {/* Chart Section */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Volume Trend</h2>
            <div className="flex gap-2 flex-wrap">
              {(['7days', '30days', '90days'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    backgroundColor: range === r ? themeConfig.accent.primary : themeConfig.bg.secondary,
                    color: range === r ? '#000' : themeConfig.text.secondary,
                  }}
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-semibold transition-colors"
                >
                  {r === '7days' ? '7D' : r === '30days' ? '30D' : '90D'}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeConfig.accent.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={themeConfig.accent.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={themeConfig.border.light} />
                <XAxis stroke={themeConfig.text.secondary} style={{ fontSize: '12px' }} />
                <YAxis stroke={themeConfig.text.secondary} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeConfig.bg.tertiary,
                    border: `1px solid ${themeConfig.border.light}`,
                    borderRadius: '8px',
                    color: themeConfig.text.primary,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke={themeConfig.accent.primary}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{ color: themeConfig.text.secondary }}
              className="h-72 flex items-center justify-center"
            >
              No data available
            </div>
          )}
        </Card>

        {/* Recent Payments Table - Responsive with horizontal scroll on mobile */}
        <Card className="overflow-hidden">
          <h2 className="text-lg sm:text-xl font-bold mb-6">Recent Payments</h2>
          {recentPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr style={{ borderBottomColor: themeConfig.border.light }} className="border-b">
                    <th
                      style={{ color: themeConfig.text.secondary }}
                      className="px-3 sm:px-4 py-3 text-left font-semibold"
                    >
                      Payment ID
                    </th>
                    <th
                      style={{ color: themeConfig.text.secondary }}
                      className="px-3 sm:px-4 py-3 text-left font-semibold"
                    >
                      Amount
                    </th>
                    <th
                      style={{ color: themeConfig.text.secondary }}
                      className="px-3 sm:px-4 py-3 text-left font-semibold"
                    >
                      Token
                    </th>
                    <th
                      style={{ color: themeConfig.text.secondary }}
                      className="px-3 sm:px-4 py-3 text-left font-semibold"
                    >
                      Status
                    </th>
                    <th
                      style={{ color: themeConfig.text.secondary }}
                      className="px-3 sm:px-4 py-3 text-left font-semibold"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      style={{ borderBottomColor: themeConfig.border.light }}
                      className="border-b hover:opacity-80 transition-opacity"
                    >
                      <td
                        style={{ color: themeConfig.text.secondary }}
                        className="px-3 sm:px-4 py-3 truncate text-xs sm:text-sm font-mono"
                      >
                        {payment.id.slice(0, 8)}...
                      </td>
                      <td style={{ color: themeConfig.accent.primary }} className="px-3 sm:px-4 py-3 font-semibold">
                        {payment.amount.toFixed(3)}
                      </td>
                      <td style={{ color: themeConfig.text.primary }} className="px-3 sm:px-4 py-3">
                        {payment.token}
                      </td>
                      <td className="px-3 sm:px-4 py-3">{getStatusBadge(payment.status)}</td>
                      <td style={{ color: themeConfig.text.secondary }} className="px-3 sm:px-4 py-3 text-xs">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: themeConfig.text.secondary }}>No payments yet</p>
          )}
        </Card>
      </main>
    </div>
  )
}

export default DashboardContent
