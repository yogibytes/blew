import React from 'react'

interface ErrorScreenProps {
  error: string | Error
  onRetry?: () => void
  onClose?: () => void
  darkMode?: boolean
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  onRetry,
  onClose,
  darkMode = false,
}) => {
  const bgColor = darkMode ? '#0f0f1e' : '#ffffff'
  const textColor = darkMode ? '#ffffff' : '#000000'
  const borderColor = darkMode ? '#3d3d5c' : '#e2e8f0'
  const errorMessage = error instanceof Error ? error.message : error

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
      {/* Error Icon */}
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>

      {/* Title */}
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
        Payment Failed
      </h2>

      {/* Error Message */}
      <div
        style={{
          padding: '16px',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px',
          wordBreak: 'break-word',
        }}
      >
        {errorMessage}
      </div>

      {/* Tips */}
      <div
        style={{
          padding: '12px',
          backgroundColor: darkMode ? '#1a1a2e' : '#f8fafc',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '13px',
          textAlign: 'left',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '8px' }}>Troubleshooting:</strong>
        <ul style={{ marginLeft: '16px', opacity: 0.8 }}>
          <li>Ensure you have enough SOL/USDC in your wallet</li>
          <li>Make sure Phantom wallet is connected</li>
          <li>Check your internet connection</li>
          <li>Try a different browser or device</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              flex: 1,
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
          >
            Retry
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: darkMode ? '#3d3d5c' : '#e2e8f0',
            color: textColor,
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
