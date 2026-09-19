import React from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

export interface BlewWalletProviderProps {
  children: React.ReactNode
  endpoint?: string
  autoConnect?: boolean
}

export const BlewWalletProvider: React.FC<BlewWalletProviderProps> = ({
  children,
  endpoint = clusterApiUrl('testnet'),
  autoConnect = true,
}) => {
  const wallets = React.useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}