'use client'

import React, { useState, useEffect } from 'react'
import { StatsCard } from './StatsCard'
import { PaymentChart } from './PaymentChart'
import { RecentPayments } from './RecentPayments'
import { Card, CardContent } from '@/components/Common/Card'
import { Spinner } from '@/components/Common/Spinner'
import { useApi } from '@/hooks/useApi'
import { useMerchant } from '@/hooks/useMerchant'
import { formatters } from '@/utils/formatting'
import { DashboardStats } from '@/types'

export interface DashboardLayoutProps {
  onLogout?: () => void
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const { execute, loading } = useApi<DashboardStats>()
  const { merchant, apiKey } = useMerchant()

  useEffect(() => {
    const fetchStats = async () => {
      if (!apiKey) return

      try {
        const data = await execute('/api/dashboard/stats', {
          method: 'GET',
          apiKey: apiKey || undefined,
        })
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      }
    }

    fetchStats()

    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [apiKey, execute])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-float-in">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          {merchant && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{merchant.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Volume"
          value={
            loading || !stats
              ? '-'
              : formatters.formatUSD(stats.volume)
          }
          unit={loading || !stats ? '' : 'USD'}
          loading={loading}
          variant="primary"
          icon={
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.16 5a.75.75 0 0 0-.01 1.06l2.25 2.25H2.75a.75.75 0 0 0 0 1.5h7.65l-2.25 2.25a.75.75 0 1 0 1.06 1.06l3.5-3.5a.75.75 0 0 0 0-1.06l-3.5-3.5a.75.75 0 0 0-1.06.01Z" />
            </svg>
          }
        />

        <StatsCard
          title="Transactions"
          value={loading || !stats ? '-' : stats.transactions}
          loading={loading}
          variant="success"
          icon={
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1H2V3Z" />
              <path
                fillRule="evenodd"
                d="M2 5h16v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5Zm12 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatsCard
          title="Success Rate"
          value={loading || !stats ? '-' : formatters.formatPercentage(stats.successRate)}
          loading={loading}
          variant="accent"
          icon={
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatsCard
          title="Avg Transaction"
          value={
            loading || !stats
              ? '-'
              : formatters.formatUSD(
                  stats.transactions > 0
                    ? stats.volume / stats.transactions
                    : 0
                )
          }
          loading={loading}
          variant="info"
          icon={
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5zM8 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7zM14 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4z" />
            </svg>
          }
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentChart />
        </div>

        {/* Merchant Info Card */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Merchant Name
              </h3>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {merchant?.name}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email
              </h3>
              <p className="mt-1 break-all text-sm text-gray-900 dark:text-white">
                {merchant?.email}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Wallet Address
              </h3>
              <p className="mt-1 break-all font-mono text-xs text-gray-900 dark:text-white">
                {merchant?.walletAddress}
              </p>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="mt-4 w-full rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
              >
                Logout
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <RecentPayments />
    </div>
  )
}
