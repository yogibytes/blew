'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/Common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Common/Card'
import { formatters } from '@/utils/formatting'
import { Payment } from '@/types'

export interface PaymentSuccessProps {
  payment: Payment
  onNewPayment?: () => void
  onViewReceipt?: () => void
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  payment,
  onNewPayment,
  onViewReceipt,
}) => {
  const [showDismiss, setShowDismiss] = useState(false)

  useEffect(() => {
    // Show dismiss option after 10 seconds
    const timer = setTimeout(() => setShowDismiss(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="animate-slideIn">
      <CardHeader>
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 p-4 dark:bg-green-900">
            <svg
              className="h-8 w-8 animate-checkmark text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <CardTitle className="text-center">Payment Confirmed</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment details */}
        <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatters.formatCurrency(payment.amount, payment.token)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Payment ID</span>
              <span className="font-mono text-xs text-gray-900 dark:text-white">
                {formatters.formatPaymentId(payment.id)}
              </span>
            </div>
          </div>

          {payment.solanaSignature && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Signature</span>
                <a
                  href={`https://explorer.solana.com/tx/${payment.solanaSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View on Solana Explorer
                </a>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Timestamp</span>
              <span className="font-mono text-xs text-gray-900 dark:text-white">
                {formatters.formatDate(payment.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onViewReceipt && (
            <Button onClick={onViewReceipt} variant="secondary" fullWidth>
              View Receipt
            </Button>
          )}
          {onNewPayment && (
            <Button onClick={onNewPayment} variant="primary" fullWidth>
              New Payment
            </Button>
          )}
        </div>

        {/* Dismiss message */}
        {showDismiss && (
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            You can safely close this window
          </p>
        )}
      </CardContent>
    </Card>
  )
}
