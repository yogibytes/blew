'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-gray-200 text-gray-900 dark:bg-gray-700/50 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm',
        success: 'bg-gradient-to-r from-green-100 to-green-50 text-green-900 dark:from-green-900/50 dark:to-green-800/30 dark:text-green-200 border border-green-300 dark:border-green-700/50 shadow-sm shadow-green-500/20',
        error: 'bg-gradient-to-r from-red-100 to-red-50 text-red-900 dark:from-red-900/50 dark:to-red-800/30 dark:text-red-200 border border-red-300 dark:border-red-700/50 shadow-sm shadow-red-500/20',
        warning: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-900 dark:from-yellow-900/50 dark:to-yellow-800/30 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700/50 shadow-sm shadow-yellow-500/20',
        info: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 dark:from-blue-900/50 dark:to-blue-800/30 dark:text-blue-200 border border-blue-300 dark:border-blue-700/50 shadow-sm shadow-blue-500/20',
        accent: 'bg-gradient-to-r from-amber-400 to-amber-300 text-gray-900 dark:from-amber-700/50 dark:to-amber-600/30 dark:text-amber-100 border border-amber-500/50 dark:border-amber-600/50 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'
