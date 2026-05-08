'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { apiClient } from '@/utils/api'
import { useMerchant } from '@/hooks/useMerchant'
import { Merchant, DashboardStats, Payment } from '@/types'

interface ChartResponse {
  labels: string[]
  data: number[]
}

export default function DashboardPage() {
  const router = useRouter()
  const { merchant, apiKey, clearMerchant } = useMerchant()
  
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chart, setChart] = useState<ChartResponse | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!merchant || !apiKey) {
        router.push('/login')
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch stats
        const statsData = await apiClient.get<DashboardStats>(
          '/api/dashboard/stats',
          apiKey
        )
        setStats(statsData)

        // Fetch chart data
        const chartData = await apiClient.get<ChartResponse>(
          '/api/dashboard/chart?range=7days',
          apiKey
        )
        setChart(chartData)

        // Fetch payments list
        const paymentsData = await apiClient.get<Payment[]>(
          '/api/payments/list',
          apiKey
        )
        setPayments(paymentsData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
        setError(errorMessage)
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [merchant, apiKey, router])

  const handleLogout = () => {
    clearMerchant()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center">
                  B
                </div>
                <span className="hidden font-bold text-gray-900 dark:text-white sm:inline-block">
                  Blew
                </span>
              </Link>
              <DarkModeToggle />
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading dashboard...
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!merchant) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center">
                B
              </div>
              <span className="hidden font-bold text-gray-900 dark:text-white sm:inline-block">
                Blew
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{merchant.name}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              💰 Total Volume
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {stats ? `${stats.volume} SOL` : '-'}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              📊 Total Transactions
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {stats ? stats.transactions : '-'}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              ✅ Success Rate
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {stats ? `${(stats.successRate * 100).toFixed(1)}%` : '-'}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              📈 Avg Transaction
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {stats ? `${stats.avgTransaction} SOL` : '-'}
            </div>
          </Card>
        </div>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📋 Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Name
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white">{merchant.name}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Email
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white break-all">{merchant.email}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Wallet Address
              </label>
              <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-mono break-all">{merchant.walletAddress}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                API Key (Last 4 digits)
              </label>
              <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-mono">••••{merchant.apiKey?.slice(-4)}</p>
            </div>
          </div>
        </Card>

        {payments.length > 0 && (
          <Card className="p-4 sm:p-6 mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🔄 Recent Payments
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-600 dark:text-gray-400 pb-3">ID</th>
                    <th className="text-left text-xs font-medium text-gray-600 dark:text-gray-400 pb-3">Amount</th>
                    <th className="text-left text-xs font-medium text-gray-600 dark:text-gray-400 pb-3">Token</th>
                    <th className="text-left text-xs font-medium text-gray-600 dark:text-gray-400 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 5).map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="py-3 text-xs text-gray-900 dark:text-white font-mono">{payment.id.slice(0, 8)}...</td>
                      <td className="py-3 text-xs text-gray-900 dark:text-white">{payment.amount}</td>
                      <td className="py-3 text-xs text-gray-900 dark:text-white">{payment.token}</td>
                      <td className="py-3 text-xs">
                        <span className={`px-2 py-1 rounded text-white text-xs font-medium ${
                          payment.status === 'confirmed' ? 'bg-green-600' :
                          payment.status === 'pending' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <div className="mt-6 sm:mt-8 flex gap-4">
          <Button variant="outline" onClick={handleLogout}>
            🚪 Logout
          </Button>
          <Button 
            variant="ghost"
            onClick={() => router.push('/')}
          >
            ← Back to Home
          </Button>
        </div>
      </main>
    </div>
  )
}
