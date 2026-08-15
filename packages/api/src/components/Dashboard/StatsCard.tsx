'use client'

import React from 'react'
import { Card, CardContent } from '@/components/Common/Card'
import { Spinner } from '@/components/Common/Spinner'

export interface StatsCardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  icon?: React.ReactNode
  loading?: boolean
  variant?: 'primary' | 'success' | 'accent' | 'info'
}

const variantStyles = {
  primary: 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-900 dark:from-blue-900/50 dark:to-blue-800/30 dark:text-blue-200 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10',
  success: 'bg-gradient-to-br from-green-100 to-green-50 text-green-900 dark:from-green-900/50 dark:to-green-800/30 dark:text-green-200 shadow-lg shadow-green-500/20 dark:shadow-green-500/10',
  accent: 'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-900 dark:from-amber-900/50 dark:to-amber-800/30 dark:text-amber-200 shadow-lg shadow-amber-500/20 dark:shadow-amber-500/10',
  info: 'bg-gradient-to-br from-purple-100 to-purple-50 text-purple-900 dark:from-purple-900/50 dark:to-purple-800/30 dark:text-purple-200 shadow-lg shadow-purple-500/20 dark:shadow-purple-500/10',
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  change,
  icon,
  loading = false,
  variant = 'primary',
}) => {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/10 glow-box hover:glow-box-strong transition-all duration-300 hover:-translate-y-1 animate-slide-in-up-glow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{title}</p>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
                  {unit && (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{unit}</span>
                  )}
                </>
              )}
            </div>

            {change !== undefined && !loading && (
              <p
                className={`mt-2 text-sm font-semibold ${
                  change >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
              </p>
            )}
          </div>

          {icon && (
            <div className={`rounded-xl p-3 transition-all duration-300 group-hover:scale-110 ${variantStyles[variant]}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
