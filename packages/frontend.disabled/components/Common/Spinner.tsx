'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin transition-all', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    },
    color: {
      primary: 'text-blue-600 dark:text-blue-400 drop-shadow-lg drop-shadow-blue-500/50',
      white: 'text-white drop-shadow-lg',
      gray: 'text-gray-400 dark:text-gray-500',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size, color, className }) => (
  <svg
    className={cn(spinnerVariants({ size, color }), className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)
