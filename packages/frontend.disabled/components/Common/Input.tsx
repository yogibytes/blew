'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type = 'text', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-lg focus:shadow-blue-500/20 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600/50 dark:bg-gray-800/50 dark:text-white dark:focus:ring-blue-400/50 dark:focus:shadow-blue-500/30',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-300 focus:shadow-red-500/20 dark:focus:shadow-red-500/30',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
