import * as React from 'react'

import { Card } from './card'
import { useTheme } from '../../context/ThemeContext'

export { Button, buttonVariants } from './button'
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
export { Input } from './input'
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table'
export { Badge, badgeVariants } from './badge'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  accentColor?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  icon,
  accentColor = 'primary',
  className = '',
}: StatCardProps) {
  const { themeConfig } = useTheme()
  const changeColor = change && change > 0 ? themeConfig.accent.success : themeConfig.accent.danger

  return (
    <Card className={`space-y-2 ${className}`.trim()}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <p style={{ color: themeConfig.text.secondary }} className="text-sm font-medium">
            {label}
          </p>
          <p style={{ color: themeConfig.accent[accentColor] }} className="text-2xl font-bold break-words">
            {value}
          </p>
        </div>
        {icon && (
          <div style={{ color: themeConfig.accent.primary }} className="text-2xl">
            {icon}
          </div>
        )}
      </div>
      {change !== undefined && (
        <p style={{ color: changeColor }} className="text-xs font-semibold">
          {change > 0 ? '+' : ''}
          {change}% from last week
        </p>
      )}
    </Card>
  )
}
