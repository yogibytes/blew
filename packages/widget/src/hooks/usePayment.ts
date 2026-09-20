import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTransaction } from './useTransaction'
export interface PaymentRequest {
  id: string
  amount: number
  token: 'SOL' | 'USDC'
  status: 'pending' | 'confirmed' | 'failed'
  recipientPublicKey: string
  expiresAt: string
  metadata?: Record<string, any>,
  signature:string
}
export interface UsePaymentReturn {
  payment: PaymentRequest | null
  loading: boolean
  error: Error | null
  createPayment: (merchantId: string, amount: number, token: string, metadata?: Record<string, any>) => Promise<PaymentRequest>
}
export const usePayment = (apiKey?: string): UsePaymentReturn => {
  const { publicKey } = useWallet()
  const { submitTransaction } = useTransaction()
  const [payment, setPayment] = useState<PaymentRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createPayment = useCallback(
    async (merchantId: string, amount: number, token: string, metadata?: Record<string, any>) => {
      try {
        setLoading(true)
        setError(null)

        const key = apiKey || localStorage.getItem('blew-api-key')
        if (!key) throw new Error('No API key provided.')

        if (!publicKey) throw new Error('Wallet is not connected')

        const apiBase = localStorage.getItem('blew-api-base')?.replace(/\/$/, '') || ''
        const paymentEndpoint = `${apiBase}/api/payment`

        const prepareResponse = await fetch(paymentEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantId, api: key, amount, token, metadata }),
        })
        const prepareData = await prepareResponse.json()
        if (!prepareResponse.ok) throw new Error(prepareData.error || prepareData.message || 'Unable to prepare payment')

        const merchantWalletAddress = prepareData.data?.recipientPublicKey
          || prepareData.response?.merchantwallet
        if (!merchantWalletAddress) throw new Error('Payment service did not provide a merchant wallet')

        const signature = await submitTransaction(merchantWalletAddress, amount)

        const response = await fetch(paymentEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantId,
            api: key,
            userWalletAddress: publicKey.toBase58(),
            amount,
            token,
            metadata,
            signature
          }),
        })

        const data = await response.json()
        console.log(data)

        if (!response.ok) {
          throw new Error(data.message || `Payment failed: ${response.status}`)
        }

        const paymentData: PaymentRequest = {
          id: data.data?.id || data.id,
          amount: data.data?.amount || amount,
          token: data.data?.token || token,
          status: data.data?.status || 'pending',
          recipientPublicKey: data.data?.recipientPublicKey || merchantWalletAddress,
          expiresAt: data.data?.expiresAt,
          metadata: data.data?.metadata,
          signature
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
    [apiKey, publicKey, submitTransaction] // ✅ all dependencies
  )

  return { payment, loading, error, createPayment }
}