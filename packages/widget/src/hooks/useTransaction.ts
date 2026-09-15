import { useState, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallets } from './useWallet'
export interface UseTransactionReturn {
  signature: string | null
  confirmed: boolean
  confirming: boolean
  error: Error | null
  submitTransaction: () => Promise<string>
  pollForConfirmation: (signature: string, maxAttempts?: number) => Promise<boolean>
}
export const useTransaction = () => {
  const { connection } = useConnection()
  const { sendTransaction } = useWallet()
  const { publicKey } = useWallets()

  const [signature, setSignature] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submitTransaction = useCallback(async (
    merchantWalletAddress: string,  
    amount: number                  
  ): Promise<string> => {
    try {
      setError(null)

      if (!publicKey) throw new Error('Wallet not connected')

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: new PublicKey(merchantWalletAddress),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      )

      const sig = await sendTransaction(transaction, connection)
      console.log(`Signature: ${sig}`)
      setSignature(sig)
      return sig
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to submit transaction')
      setError(error)
      throw error
    }
  }, [connection, sendTransaction, publicKey])

  return { signature, confirmed, confirming, error, submitTransaction, pollForConfirmation: async () => true }
}