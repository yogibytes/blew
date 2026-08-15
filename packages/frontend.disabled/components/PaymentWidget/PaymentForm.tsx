'use client'

import React, { useState } from 'react'
import { Button } from '@/components/Common/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Common/Card'
import { Input } from '@/components/Common/Input'
import { Badge } from '@/components/Common/Badge'
import { showError } from '@/components/Common/Toast'
import { useApi } from '@/hooks/useApi'
import { usePayment } from '@/hooks/usePayment'
import { useMerchant } from '@/hooks/useMerchant'
import { validators } from '@/utils/validation'
import { formatters } from '@/utils/formatting'
import { Payment, Token, PaymentRequest } from '@/types'

export interface PaymentFormProps {
  merchantName?: string
  merchantWallet?: string
  onPaymentCreated?: (payment: Payment) => void
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  merchantName = 'Store',
  merchantWallet,
  onPaymentCreated,
}) => {
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState<Token>('SOL')
  const [amountError, setAmountError] = useState<string | null>(null)
  const { execute, loading } = useApi<Payment>()
  const { setPayment: storePayment, setAmount: storeAmount, setToken: storeToken } = usePayment()
  const { apiKey } = useMerchant()

  const handleAmountChange = (value: string) => {
    setAmount(value)
    setAmountError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validators.validateAmount(amount)
    if (error) {
      setAmountError(error)
      return
    }

    if (!merchantWallet) {
      showError('Configuration error', 'Merchant wallet not configured')
      return
    }

    if (!apiKey) {
      showError('Authentication error', 'API key not found')
      return
    }

    try {
      const payload: PaymentRequest = {
        amount: parseFloat(amount),
        token,
        recipientWallet: merchantWallet,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      }

      const payment = await execute('/api/payments', {
        method: 'POST',
        body: payload,
        apiKey,
      })

      storePayment(payment)
      storeAmount(amount)
      storeToken(token)

      if (onPaymentCreated) {
        onPaymentCreated(payment)
      }
    } catch (err) {
      showError('Payment creation failed', err instanceof Error ? err.message : 'Please try again')
    }
  }

  return (
    <Card variant="interactive" className="animate-slideIn">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Send {token} to {merchantName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Merchant info */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Recipient</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
              {merchantName}
            </p>
            {merchantWallet && (
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {formatters.shortenAddress(merchantWallet)}
              </p>
            )}
          </div>

          {/* Amount input */}
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            max="10000"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            error={amountError || undefined}
          />

          {/* Token selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Token
            </label>
            <div className="flex gap-2">
              {(['SOL', 'USDC'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setToken(t)}
                  className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                    token === t
                      ? 'bg-blue-900 text-white dark:bg-blue-800'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Fee display */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estimated fee</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {amount ? (parseFloat(amount) * 0.01).toFixed(4) : '0'} {token}
            </span>
          </div>

          {/* Devnet badge */}
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              Devnet
            </Badge>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              This is a test environment. No real funds will be transferred.
            </p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            disabled={loading || !amount}
          >
            Create Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
