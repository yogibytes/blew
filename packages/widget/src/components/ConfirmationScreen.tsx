import React from 'react'

interface ConfirmationScreenProps {
  paymentId: string
  signature?: string
  amount: number
  token: string
  onClose?: () => void
  darkMode?: boolean
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  paymentId,
  signature,
  amount,
  token,
  onClose,
  darkMode = false,
}) => {
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
        padding: '40px 24px',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: darkMode ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Success Icon */}
      <div
        style={{
          fontSize: '64px',
          marginBottom: '16px',
          animation: 'scaleIn 0.6s ease-out',
        }}
      >
        ✅
      </div>

      {/* Title */}
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
        Payment Confirmed!
      </h2>

      {/* Subtitle */}
      <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '24px' }}>
        Your payment has been successfully processed on the Solana blockchain.
      </p>

      {/* Payment Details */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            padding: '16px',
            backgroundColor: darkMode ? '#1a1a2e' : '#f8fafc',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ opacity: 0.7 }}>Amount</span>
            <span style={{ fontWeight: '600', color: '#10b981' }}>
              {amount} {token}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ opacity: 0.7 }}>Payment ID</span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {paymentId.slice(0, 16)}...
            </span>
          </div>
          {signature && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0px' }}>
              <span style={{ opacity: 0.7 }}>TX Signature</span>
              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                {signature.slice(0, 16)}...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#00f0ff',
          color: '#000000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        Done
      </button>

      {/* Watermark */}
      <div style={{ marginTop: '16px', fontSize: '12px', opacity: 0.5 }}>
        Powered by 🌬️ Blew
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
