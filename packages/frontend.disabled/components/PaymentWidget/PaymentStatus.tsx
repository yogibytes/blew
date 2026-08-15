'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/Common/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Common/Card'
import { Badge } from '@/components/Common/Badge'
import { Spinner } from '@/components/Common/Spinner'
import { useApi } from '@/hooks/useApi'
import { useMerchant } from '@/hooks/useMerchant'
import { formatters } from '@/utils/formatting'
import { Payment } from '@/types'

export interface PaymentStatusProps {
  paymentId: string
  onStatusChange?: (payment: Payment) => void
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentId, onStatusChange }) => {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(900) // 15 minutes in seconds
  const { execute, loading } = useApi<Payment>()
  const { apiKey } = useMerchant()
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)

  // Poll for payment status
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await execute(`/api/payments/${paymentId}`, {
          method: 'GET',
          apiKey,
        })
        setPayment(data)

        if (data.status !== 'pending') {
          if (pollInterval) clearInterval(pollInterval)
          if (onStatusChange) onStatusChange(data)
        } else {
          if (onStatusChange) onStatusChange(data)
        }
      } catch (err) {
        // Handle error silently during polling
      }
    }

    // Fetch immediately
    fetchPayment()

    // Poll every 2 seconds if payment is still pending
    const interval = setInterval(() => {
      if (payment?.status === 'pending') {
        fetchPayment()
      }
    }, 2000)

    setPollInterval(interval)

    return () => clearInterval(interval)
  }, [paymentId, apiKey, execute, onStatusChange, payment?.status, pollInterval])

  // Countdown timer
  useEffect(() => {
    if (!payment || payment.status !== 'pending') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [payment])

  if (!payment) {
    return (
      <Card className="animate-slideIn">
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    )
  }

  const statusVariant = {
    pending: 'info',
    confirmed: 'success',
    completed: 'success',
    failed: 'error',
  }[payment.status] as 'info' | 'success' | 'error'

  const statusLabel = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    failed: 'Failed',
  }[payment.status]

  return (
    <Card variant="interactive" className="animate-slideIn">
      <CardHeader>
        <CardTitle>Payment Status</CardTitle>
        <CardDescription>Payment ID: {formatters.formatPaymentId(payment.id)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant} size="md">
            {statusLabel}
          </Badge>
          {payment.status === 'pending' && <Spinner size="sm" color="primary" />}
        </div>

        {/* Payment details */}
        <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatters.formatCurrency(payment.amount, payment.token)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Recipient</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">
              {formatters.shortenAddress(payment.recipientWallet)}
            </span>
          </div>

          {payment.solanaSignature && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Signature</span>
              <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                {formatters.shortenAddress(payment.solanaSignature, 6)}
              </span>
            </div>
          )}
        </div>

        {/* Timer */}
        {payment.status === 'pending' && (
          <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900">
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Expires in
            </span>
            <span className="font-mono font-bold text-yellow-900 dark:text-yellow-100">
              {formatters.formatTime(timeLeft)}
            </span>
          </div>
        )}

        {/* Copy button */}
        <Button
          onClick={() => navigator.clipboard.writeText(payment.id)}
          variant="secondary"
          fullWidth
          size="sm"
        >
          Copy Payment ID
        </Button>
      </CardContent>
    </Card>
  )
}
