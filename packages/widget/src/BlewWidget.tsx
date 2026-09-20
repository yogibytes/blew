'use client'

import React, { useState, useEffect } from 'react'
import { PaymentModal, ConfirmationScreen, ErrorScreen } from './components'
import { useTransaction } from './hooks/useTransaction'
import type { PaymentRequest } from './hooks/usePayment'

export interface BlewWidgetProps {
  merchantId: string
  amount: number | string
  token?: 'SOL' | 'USDC'
  currency?: string
  onSuccess?: (data: { paymentId: string; signature?: string; amount: number; token: string }) => void
  onError?: (error: Error) => void
  darkMode?: boolean
  metadata?: Record<string, any>
  apiKey?: string
  apiBase?: string
  style?: React.CSSProperties
  className?: string
}

type PaymentState = 'idle' | 'creating' | 'confirming' | 'confirmed' | 'error'

export const BlewWidget: React.FC<BlewWidgetProps> = ({
  merchantId,
  amount,
  token = 'SOL',
  currency = 'USD',
  onSuccess,
  onError,
  darkMode = false,
  metadata = {},
  apiKey,
  apiBase,
  style,
  className = '',
}) => {
  const [state, setState] = useState<PaymentState>('idle')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [paymentSignature, setPaymentSignature] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const { pollForConfirmation } = useTransaction()

  // Store API key and base in localStorage if provided
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('blew-api-key', apiKey)
    }
    if (apiBase) {
      localStorage.setItem('blew-api-base', apiBase)
    } else {
      localStorage.removeItem('blew-api-base')
    }
  }, [apiKey, apiBase])

  const handlePaymentCreated = async (payment: PaymentRequest) => {
    setPaymentId(payment.id)
    setPaymentSignature(payment.signature)
    setState('confirming')

    try {
      const confirmed = await pollForConfirmation(payment.signature, 120)
      
      if (confirmed) {
        setState('confirmed')
        
        if (onSuccess) {
          onSuccess({
            paymentId: payment.id,
            signature: payment.signature,
            amount: parseFloat(amount.toString()),
            token,
          })
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment confirmation failed')
      setError(error)
      setState('error')
      if (onError) {
        onError(error)
      }
    }
  }

  const handlePaymentError = (err: Error) => {
    setError(err)
    setState('error')
    if (onError) {
      onError(err)
    }
  }

  const handleRetry = () => {
    setPaymentId(null)
    setPaymentSignature(null)
    setError(null)
    setState('idle')
  }

  const handleClose = () => {
    setPaymentId(null)
    setPaymentSignature(null)
    setError(null)
    setState('idle')
  }

  const containerStyle: React.CSSProperties = {
    ...style,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    fontSize: '16px',
    lineHeight: '1.5',
    color: darkMode ? '#ffffff' : '#000000',
  }

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  }

  return (
    <div style={containerStyle} className={`blew-widget ${darkMode ? 'dark' : 'light'} ${className}`}>
      {state === 'idle' && (
        <div style={wrapperStyle}>
          <PaymentModal
            merchantId={merchantId}
            amount={parseFloat(amount.toString())}
            token={token as 'SOL' | 'USDC'}
            onPaymentCreated={handlePaymentCreated}
            onError={handlePaymentError}
            darkMode={darkMode}
            apiKey={apiKey}
            metadata={metadata}
          />
        </div>
      )}

      {state === 'creating' && (
        <div style={wrapperStyle}>
          <div
            style={{
              textAlign: 'center',
              color: darkMode ? '#ffffff' : '#000000',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>
              ⏳
            </div>
            <p>Creating payment...</p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {state === 'confirming' && (
        <div style={wrapperStyle}>
          <div
            style={{
              textAlign: 'center',
              color: darkMode ? '#ffffff' : '#000000',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'pulse 1.5s ease-in-out infinite' }}>
              🌬️
            </div>
            <p>Confirming payment...</p>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>This may take up to 2 minutes</p>
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}</style>
          </div>
        </div>
      )}

      {state === 'confirmed' && paymentId && (
        <div style={wrapperStyle}>
          <ConfirmationScreen
            paymentId={paymentId}
            signature={paymentSignature ?? undefined}
            amount={parseFloat(amount.toString())}
            token={token}
            onClose={handleClose}
            darkMode={darkMode}
          />
        </div>
      )}

      {state === 'error' && error && (
        <div style={wrapperStyle}>
          <ErrorScreen
            error={error}
            onRetry={handleRetry}
            onClose={handleClose}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  )
}

export default BlewWidget
