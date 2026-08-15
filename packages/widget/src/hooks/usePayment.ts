import { useState, useCallback } from 'react'

export interface PaymentRequest {
  id: string
  amount: number
  token: 'SOL' | 'USDC'
  status: 'pending' | 'confirmed' | 'failed'
  recipientPublicKey: string
  expiresAt: string
  metadata?: Record<string, any>
}

export interface UsePaymentReturn {
  payment: PaymentRequest | null
  loading: boolean
  error: Error | null
  createPayment: (merchantId: string, amount: number, token: string, metadata?: Record<string, any>) => Promise<PaymentRequest>
}

export const usePayment = (apiKey?: string): UsePaymentReturn => {
  const [payment, setPayment] = useState<PaymentRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createPayment = useCallback(
    async (merchantId: string, amount: number, token: string, metadata?: Record<string, any>) => {
      try {
        setLoading(true)
        setError(null)

        // Use provided API key or get from localStorage
        const key = apiKey || localStorage.getItem('blew-api-key')
        if (!key) {
          throw new Error('No API key provided. Please configure your API key.')
        }

        // Determine API base URL (default to localhost for dev, can be overridden)
        // const apiBase = localStorage.getItem('blew-api-base') || 'http://localhost:3000'

        const response = await fetch("http://localhost:3000/api/payment", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': key, 
          },
          body: JSON.stringify({
            merchantId,
            amount,
            token,
            metadata,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Payment creation failed: ${response.status}`)
        }

        const data = await response.json()
        const paymentData: PaymentRequest = {
          id: data.data?.id || data.id,
          amount: data.data?.amount || amount,
          token: data.data?.token || token,
          status: data.data?.status || 'pending',
          recipientPublicKey: data.data?.recipientPublicKey || data.data?.publicKey,
          expiresAt: data.data?.expiresAt,
          metadata: data.data?.metadata,
        }

        setPayment(paymentData)
        return paymentData
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create payment')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [apiKey]
  )

  return { payment, loading, error, createPayment }
}
