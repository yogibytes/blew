import React from 'react'
import { useWallet } from '../hooks/useWallet'

interface WalletConnectProps {
  onConnected?: (publicKey: string) => void
  darkMode?: boolean
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnected, darkMode = false }) => {
  const { connected, publicKey, connecting, error, connect } = useWallet()

  React.useEffect(() => {
    if (connected && publicKey && onConnected) {
      onConnected(publicKey)
    }
  }, [connected, publicKey, onConnected])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (err) {
      console.error('Connection error:', err)
    }
  }

  if (connected && publicKey) {
    return (
      <div
        style={{
          backgroundColor: darkMode ? '#1a1a2e' : '#f0f0f0',
          color: darkMode ? '#ffffff' : '#000000',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        ✓ {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={connecting}
        style={{
          backgroundColor: '#14F195',
          color: '#000000',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: connecting ? 'not-allowed' : 'pointer',
          opacity: connecting ? 0.7 : 1,
          width: '100%',
          transition: 'opacity 0.2s',
        }}
      >
        {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
      </button>
      {error && (
        <div
          style={{
            color: '#ef4444',
            fontSize: '12px',
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
          {error.message}
        </div>
      )}
    </div>
  )
}
