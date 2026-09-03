import { useState, useEffect, useCallback } from 'react'

export interface PhantomWindow extends Window {
  solana?: {
    isPhantom?: boolean
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
    disconnect: () => Promise<void>
    on: (event: string, callback: (args: any) => void) => void
    removeListener: (event: string, callback: (args: any) => void) => void
    publicKey: { toString: () => string } | null
    signTransaction?: (transaction: any) => Promise<any>
    signAllTransactions?: (transactions: any[]) => Promise<any[]>
  }
}

export interface UseWalletReturn {
  connected: boolean
  publicKey: string | null
  connecting: boolean
  error: Error | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export const useWallet = (): UseWalletReturn => {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const phantomWindow = window as PhantomWindow
        if (!phantomWindow.solana?.isPhantom) {
          setError(new Error('Phantom wallet not installed'))
          return
        }

        // Try to connect if previously connected
        const response = await phantomWindow.solana.connect({ onlyIfTrusted: true })
        const publicKeyObtained = response.publicKey.toString();
        setPublicKey(publicKeyObtained)
        setConnected(true)
      } catch (err) {
        // Not connected yet, which is fine
        setConnected(false)
      }
    }

    checkConnection()
  }, [])

  // Listen for wallet changes
  useEffect(() => {
    const phantomWindow = window as PhantomWindow
    if (!phantomWindow.solana) return

    const handleConnect = (publicKey: any) => {
      setPublicKey(publicKey.toString())
      setConnected(true)
    }

    const handleDisconnect = () => {
      setPublicKey(null)
      setConnected(false)
    }

    phantomWindow.solana.on('connect', handleConnect)
    phantomWindow.solana.on('disconnect', handleDisconnect)

    return () => {
      phantomWindow.solana?.removeListener('connect', handleConnect)
      phantomWindow.solana?.removeListener('disconnect', handleDisconnect)
    }
  }, [])

  const connect = useCallback(async () => {
    try {
      setConnecting(true)
      setError(null)
      const phantomWindow = window as PhantomWindow

      if (!phantomWindow.solana?.isPhantom) {
        throw new Error('Phantom wallet not found. Please install Phantom.')
      }

      const response = await phantomWindow.solana.connect()
      setPublicKey(response.publicKey.toString())
      setConnected(true)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect wallet')
      setError(error)
      throw error
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      const phantomWindow = window as PhantomWindow
      await phantomWindow.solana?.disconnect()
      setPublicKey(null)
      setConnected(false)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disconnect wallet')
      setError(error)
      throw error
    }
  }, [publicKey])
  console.log(publicKey );
  return { connected, publicKey, connecting, error, connect, disconnect }
}
