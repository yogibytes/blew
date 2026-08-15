'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
}) => {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn',
        className
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full max-w-md rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-6 shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/10 border border-gray-200/50 dark:border-gray-700/50 glow-box animate-scale-in-glow',
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}
