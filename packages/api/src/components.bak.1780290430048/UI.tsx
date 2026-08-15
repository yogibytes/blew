'use client'

import React from 'react'
import { useTheme } from '../context/ThemeContext'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const { themeConfig } = useTheme()
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: themeConfig.bg.tertiary,
        borderColor: themeConfig.border.light,
        color: themeConfig.text.primary,
      }}
      className={`rounded-lg border p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-opacity-100' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  accentColor?: 'primary' | 'success' | 'warning' | 'danger'
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  accentColor = 'primary',
}) => {
  const { themeConfig } = useTheme()
  const changeColor = change && change > 0 ? themeConfig.accent.success : themeConfig.accent.danger

  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p style={{ color: themeConfig.text.secondary }} className="text-sm font-medium">
            {label}
          </p>
          <p
            style={{ color: themeConfig.accent[accentColor] }}
            className="text-2xl font-bold wrap-break-words"
          >
            {value}
          </p>
        </div>
        {icon && <div style={{ color: themeConfig.accent.primary }} className="text-2xl">{icon}</div>}
      </div>
      {change !== undefined && (
        <p style={{ color: changeColor }} className="text-xs font-semibold">
          {change > 0 ? '+' : ''}{change}% from last week
        </p>
      )}
    </Card>
  )
}

interface TableProps {
  columns: string[]
  rows: (string | number | React.ReactNode)[][]
  className?: string
}

export const Table: React.FC<TableProps> = ({ columns, rows, className = '' }) => {
  const { themeConfig } = useTheme()

  return (
    <Card className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottomColor: themeConfig.border.light }} className="border-b">
            {columns.map((col, i) => (
              <th
                key={i}
                style={{ color: themeConfig.text.secondary }}
                className="px-4 py-3 text-left font-semibold"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottomColor: themeConfig.border.light }}
              className="border-b hover:opacity-80 transition-opacity"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{ color: themeConfig.text.primary }}
                  className="px-4 py-3"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

interface BadgeProps {
  text: string
  variant?: 'success' | 'pending' | 'failed'
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'pending' }) => {
  const { themeConfig } = useTheme()

  const colorMap = {
    success: { bg: themeConfig.accent.success, opacity: 0.2 },
    pending: { bg: themeConfig.accent.warning, opacity: 0.2 },
    failed: { bg: themeConfig.accent.danger, opacity: 0.2 },
  }

  const color = colorMap[variant]

  return (
    <span
      style={{
        backgroundColor: color.bg + '33',
        color: color.bg,
      }}
      className="px-2 py-1 rounded text-xs font-semibold"
    >
      {text}
    </span>
  )
}
