import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

interface WalletConnectProps {
  onConnected?: (publicKey: string) => void
  darkMode?: boolean
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnected, darkMode = false }) => {
  const { connected, publicKey } = useWallet()

  React.useEffect(() => {
    if (connected && publicKey && onConnected) {
      onConnected(publicKey.toBase58())
    }
  }, [connected, publicKey, onConnected])

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
          ✓ {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
      </div>
    )
  }

  return (
    <div>
      <WalletMultiButton style={{ width: '100%' }} />
    </div>
  )
}
