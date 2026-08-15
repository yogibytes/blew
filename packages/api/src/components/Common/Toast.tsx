'use client'

import { Toaster, toast } from 'sonner'

export { toast }

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
    />
  )
}

// Convenience functions
export const showSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
  })
}

export const showError = (message: string, description?: string) => {
  toast.error(message, {
    description,
  })
}

export const showLoading = (message: string) => {
  toast.loading(message)
}

export const showInfo = (message: string, description?: string) => {
  toast(message, {
    description,
  })
}
