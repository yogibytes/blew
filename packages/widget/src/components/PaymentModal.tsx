import React from 'react'
import { usePayment } from '../hooks/usePayment'
import type { PaymentRequest } from '../hooks/usePayment'
import { WalletConnect } from './WalletConnect'

interface PaymentModalProps {
  merchantId: string
  amount: number
  token: 'SOL' | 'USDC'
  onPaymentCreated?: (payment: PaymentRequest) => void
  onError?: (error: Error) => void
  darkMode?: boolean
  apiKey?: string
  metadata?: Record<string, any>
}
export const PaymentModal: React.FC<PaymentModalProps> = ({
  merchantId,
  amount,
  token,
  onPaymentCreated,
  onError,
  darkMode = false,
  apiKey,
  metadata,
}) => {
  const { payment, loading, error, createPayment } = usePayment(apiKey)
  const [walletConnected, setWalletConnected] = React.useState(false)

  const handleWalletConnected = (publicKey: string) => {
    setWalletConnected(true)
  }

  const handleCreatePayment = async () => {
    try {
      const paymentData = await createPayment(merchantId, amount, token, metadata)
      if (onPaymentCreated) {
        onPaymentCreated(paymentData)
      }
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err : new Error('Failed to create payment'))
      }
    }
  }

  const bgColor = darkMode ? '#0f0f1e' : '#ffffff'
  const textColor = darkMode ? '#ffffff' : '#000000'
  const borderColor = darkMode ? '#3d3d5c' : '#e2e8f0'

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        boxShadow: darkMode ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
        💳 Payment
      </h2>

      {/* Amount Display */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: darkMode ? '#1a1a2e' : '#f8fafc',
            borderRadius: '8px',
          }}
        >
          <span style={{ fontSize: '14px', opacity: 0.8 }}>Amount</span>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#00f0ff' }}>
            {amount} {token}
          </span>
        </div>
      </div>

      {/* Wallet Connection */}
      <div style={{ marginBottom: '16px' }}>
        <WalletConnect
          onConnected={handleWalletConnected}
          darkMode={darkMode}
        />
      </div>

      {/* Payment Details */}
      {payment && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: darkMode ? '#1a1a2e' : '#f0f0f0',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong>Payment ID:</strong> {payment.id.slice(0, 8)}...
          </div>
          <div>
            <strong>Expires:</strong> {new Date(payment.expiresAt).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          Error: {error.message}
        </div>
      )}

      {/* Create Payment Button */}
      <button
        onClick={handleCreatePayment}
        disabled={!walletConnected || loading || !!payment}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: walletConnected && !payment ? '#00f0ff' : '#666',
          color: '#000000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: walletConnected && !payment ? 'pointer' : 'not-allowed',
          opacity: walletConnected && !payment ? 1 : 0.6,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? 'Creating Payment...' : payment ? 'Payment Created' : 'Create Payment'}
      </button>

      {/* Help Text */}
      {!walletConnected && (
        <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.7, textAlign: 'center' }}>
          Connect your wallet to proceed
        </div>
      )}
    </div>
  )
}
