'use client'

import React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800">
    {icon && <div className="mb-4 text-4xl text-gray-400">{icon}</div>}
    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{description}</p>}
    {action && <div className="flex gap-2">{action}</div>}
  </div>
)
