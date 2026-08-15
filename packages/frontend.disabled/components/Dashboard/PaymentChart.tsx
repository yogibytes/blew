'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Common/Card'
import { Button } from '@/components/Common/Button'
import { Spinner } from '@/components/Common/Spinner'
import { useApi } from '@/hooks/useApi'
import { useMerchant } from '@/hooks/useMerchant'
import { DashboardChartResponse } from '@/types'

type TimeRange = '7days' | '30days' | '90days'

export interface PaymentChartProps {
  title?: string
}

export const PaymentChart: React.FC<PaymentChartProps> = ({ title = 'Payment Volume' }) => {
  const [range, setRange] = useState<TimeRange>('7days')
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([])
  const { execute, loading } = useApi<DashboardChartResponse>()
  const { apiKey } = useMerchant()

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await execute(`/api/dashboard/chart?range=${range}`, {
          method: 'GET',
          apiKey: apiKey || undefined,
        })

        const data = response.labels.map((label, index) => ({
          name: label,
          value: response.values[index] || 0,
        }))

        setChartData(data)
      } catch (err) {
        console.error('Failed to fetch chart data:', err)
      }
    }

    if (apiKey) {
      fetchChart()
    }
  }, [range, apiKey, execute])

  return (
    <Card className="animate-slide-in-up-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">{title}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Payment volume over time (USD)</CardDescription>
          </div>
          <div className="flex gap-2">
            {(['7days', '30days', '90days'] as const).map((r) => (
              <Button
                key={r}
                onClick={() => setRange(r)}
                variant={range === r ? 'primary' : 'secondary'}
                size="sm"
              >
                {r === '7days' ? '7d' : r === '30days' ? '30d' : '90d'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="name"
                className="text-sm text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                className="text-sm text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                }}
                formatter={(value: any) => {
                  const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
                  return [`$${numValue.toFixed(2)}`, 'Volume']
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#fbbf24"
                dot={{ fill: '#fbbf24', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                name="Volume (USD)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
