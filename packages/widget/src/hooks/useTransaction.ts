import { useState, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
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
  const { publicKey, sendTransaction } = useWallet()

  const [signature, setSignature] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submitTransaction = useCallback(async (merchantWalletAddress: string, amount: number): Promise<string> => {
    try {
      setError(null)

      if (!publicKey) throw new Error('Wallet not connected')

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Transaction amount must be greater than zero')
      }

      let recipient: PublicKey
      try {
        recipient = new PublicKey(merchantWalletAddress)
      } catch {
        throw new Error('Merchant wallet address is invalid')
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        })
      )

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.lastValidBlockHeight = lastValidBlockHeight
      transaction.feePayer = publicKey

      const lamports = Math.round(amount * LAMPORTS_PER_SOL)
      const walletAddress = publicKey.toBase58()
      const [balance, genesisHash] = await Promise.all([
        connection.getBalance(publicKey, 'finalized'),
        connection.getGenesisHash(),
      ])
      console.info('[Blew] Solana wallet diagnostics', {
        walletAddress,
        rpcEndpoint: connection.rpcEndpoint,
        genesisHash,
        balanceLamports: balance,
        balanceSol: balance / LAMPORTS_PER_SOL,
        requestedSol: amount,
      })
      const fee = await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')
      const estimatedFee = fee.value ?? 5000

      if (balance < lamports + estimatedFee) {
        throw new Error(
          `Insufficient Devnet SOL for ${walletAddress} Required ${(lamports + estimatedFee) / LAMPORTS_PER_SOL} SOL, `
          + `available ${balance / LAMPORTS_PER_SOL} SOL from ${connection.rpcEndpoint}. `
          + 'Verify Phantom is using this exact account on Devnet.',
        )
      }

      const simulation = await connection.simulateTransaction(transaction)
      if (simulation.value.err) {
        const logs = simulation.value.logs?.filter(Boolean).join(' ')
        throw new Error(`Transaction preflight failed${logs ? `: ${logs}` : ''}`)
      }

      const sig = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })
      setSignature(sig)
      return sig
    } catch (err) {
      const nestedCause = typeof err === 'object' && err !== null && 'cause' in err
        ? (err as { cause?: unknown }).cause
        : undefined
      const cause = nestedCause instanceof Error ? `: ${nestedCause.message}` : ''
      const message = err instanceof Error ? `${err.message}${cause}` : String(err)
      const error = new Error(message || 'Failed to submit transaction')
      setError(error)
      throw error
    }
  }, [connection, sendTransaction, publicKey])

  const pollForConfirmation = useCallback(async (transactionSignature: string, maxAttempts = 30) => {
    setConfirming(true)
    setConfirmed(false)

    try {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const result = await connection.getSignatureStatuses([transactionSignature])
        const status = result.value[0]

        if (status?.err) throw new Error('Transaction failed on Solana')
        if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
          setConfirmed(true)
          return true
        }

        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      return false
    } finally {
      setConfirming(false)
    }
  }, [connection])

  return { signature, confirmed, confirming, error, submitTransaction, pollForConfirmation }
}