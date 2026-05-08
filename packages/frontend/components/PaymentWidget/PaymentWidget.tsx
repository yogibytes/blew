'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/Common/Button'
import { Card, CardContent } from '@/components/Common/Card'
import { PaymentForm } from './PaymentForm'
import { PaymentStatus } from './PaymentStatus'
import { PaymentSuccess } from './PaymentSuccess'
import { usePayment } from '@/hooks/usePayment'
import { showError } from '@/components/Common/Toast'
import { Payment } from '@/types'

export type PaymentWidgetState = 'form' | 'status' | 'success' | 'error'

export interface PaymentWidgetProps {
  merchantName?: string
  merchantWallet?: string
  onPaymentComplete?: (payment: Payment) => void
}

export const PaymentWidget: React.FC<PaymentWidgetProps> = ({
  merchantName = 'Store',
  merchantWallet,
  onPaymentComplete,
}) => {
  const [state, setState] = useState<PaymentWidgetState>('form')
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { payment, resetPayment } = usePayment()

  const handlePaymentCreated = (newPayment: Payment) => {
    setCurrentPayment(newPayment)
    setState('status')
  }

  const handleStatusChange = (updatedPayment: Payment) => {
    if (updatedPayment.status === 'completed' || updatedPayment.status === 'confirmed') {
      setCurrentPayment(updatedPayment)
      setState('success')
      if (onPaymentComplete) {
        onPaymentComplete(updatedPayment)
      }
    } else if (updatedPayment.status === 'failed') {
      setError('Payment failed. Please try again.')
      setState('error')
    }
  }

  const handleNewPayment = () => {
    resetPayment()
    setCurrentPayment(null)
    setError(null)
    setState('form')
  }

  const handleRetry = () => {
    setError(null)
    setState('form')
  }

  // Ensure merchantWallet is provided
  if (!merchantWallet) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-600 dark:text-red-400">
            Merchant wallet address is not configured
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {state === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentForm
              merchantName={merchantName}
              merchantWallet={merchantWallet}
              onPaymentCreated={handlePaymentCreated}
            />
          </motion.div>
        )}

        {state === 'status' && currentPayment && (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentStatus
              paymentId={currentPayment.id}
              onStatusChange={handleStatusChange}
            />
          </motion.div>
        )}

        {state === 'success' && currentPayment && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <PaymentSuccess
              payment={currentPayment}
              onNewPayment={handleNewPayment}
              onViewReceipt={() => {
                /* Handle receipt view */
              }}
            />
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="space-y-4 py-8">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50 p-4 dark:from-red-900/50 dark:to-red-800/30 shadow-lg shadow-red-500/20"
                  >
                    <svg
                      className="h-8 w-8 text-red-600 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Failed
                  </h3>
                  {error && (
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{error}</p>
                  )}
                  <Button onClick={handleRetry} variant="primary" fullWidth>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
