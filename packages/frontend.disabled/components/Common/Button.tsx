'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-400/60 focus-visible:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:shadow-gray-600/50 focus-visible:ring-gray-400',
        accent: 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 hover:shadow-lg hover:shadow-amber-400/50 dark:hover:shadow-amber-400/60 font-semibold focus-visible:ring-amber-400',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/50 dark:hover:shadow-green-400/60 focus-visible:ring-green-500',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/50 dark:hover:shadow-red-400/60 focus-visible:ring-red-500',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, disabled, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
)
Button.displayName = 'Button'
