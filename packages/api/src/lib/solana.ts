import { Connection, clusterApiUrl  , PublicKey } from '@solana/web3.js'

// Use Helius as primary RPC (free tier: 10M req/month)
// Fallback to public RPC if needed
const configuredCluster = process.env.SOLANA_CLUSTER
const defaultRpc = configuredCluster === 'mainnet-beta' || configuredCluster === 'devnet' || configuredCluster === 'testnet'
  ? clusterApiUrl(configuredCluster)
  : clusterApiUrl('devnet')
const HELIUS_RPC = process.env.HELIUS_RPC_URL || defaultRpc
const COMMITMENT = 'finalized' // Use finalized for confirmed transactions

let connection: Connection | null = null

/**
 * Get or create Solana connection
 * Uses devnet by default, configurable via SOLANA_CLUSTER or SOLANA_RPC_URL
 */
export function getConnection(): Connection {
  if (!connection) {
    const rpcUrl = process.env.SOLANA_RPC_URL || HELIUS_RPC
    connection = new Connection(rpcUrl, COMMITMENT)
  }
  return connection
}

/**
 * Get transaction status from Solana blockchain
 * Returns: 'confirmed', 'failed', 'pending', or 'expired'
 */
export async function getTransactionStatus(
  signature: string,
  timeoutSeconds: number = 120
): Promise<'confirmed' | 'failed' | 'pending' | 'expired'> {
  try {
    const connection = getConnection()

    // Try to get signature status
    const statuses = await connection.getSignatureStatuses([signature], {
      searchTransactionHistory: true,
    })

    if (!statuses.value || !statuses.value[0]) {
      return 'pending'
    }

    const status = statuses.value[0]

    if (status.err) {
      // Transaction failed on-chain
      return 'failed'
    }

    if (status.confirmationStatus === 'finalized') {
      // Transaction confirmed
      return 'confirmed'
    }

    return 'pending'
  } catch (error) {
    console.error('Error checking transaction status:', error)
    return 'pending' // Default to pending on error to retry later
  }
}

/**
 * Poll for transaction confirmation
 * Polls up to maxAttempts times with 1-second intervals
 * Max total time: maxAttempts seconds (120s = 2 minutes default)
 */
export async function pollTransactionConfirmation(
  signature: string,
  maxAttempts: number = 120
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getTransactionStatus(signature)

    if (status === 'confirmed') {
      console.log(`✅ Transaction ${signature.slice(0, 8)}... confirmed after ${attempt + 1} attempts`)
      return true
    }

    if (status === 'failed') {
      console.error(`❌ Transaction ${signature.slice(0, 8)}... failed`)
      return false
    }

    // Wait 1 second before next poll
    if (attempt < maxAttempts - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  console.warn(`⏱️ Transaction ${signature.slice(0, 8)}... confirmation timeout after ${maxAttempts}s`)
  return false
}

/**
 * Validate that transaction recipient matches expected address
 * Ensures payment was sent to correct merchant wallet
 */
export async function validateTransactionRecipient(
  signature: string,
  expectedRecipient: string,
  expectedSender?: string,
  expectedLamports?: number,
): Promise<boolean> {
  try {
    const connection = getConnection()
    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    })

    if (!transaction) {
      console.warn(`Transaction ${signature} not found`)
      return false
    }

    // Check if transaction has instructions
    const instructions = transaction.transaction.message.instructions
    if (!instructions || instructions.length === 0) {
      console.warn(`No instructions found in transaction ${signature}`)
      return false
    }

    const expectedRecipientKey = new PublicKey(expectedRecipient).toBase58()
    const expectedSenderKey = expectedSender ? new PublicKey(expectedSender).toBase58() : undefined

    return instructions.some((instruction) => {
      if (!('parsed' in instruction) || instruction.program !== 'system') return false

      const parsed = instruction.parsed as {
        type?: string
        info?: { source?: string; destination?: string; lamports?: number }
      }
      if (parsed.type !== 'transfer' || !parsed.info) return false

      return parsed.info.destination === expectedRecipientKey
        && (!expectedSenderKey || parsed.info.source === expectedSenderKey)
        && (expectedLamports === undefined || parsed.info.lamports === expectedLamports)
    })
  } catch (error) {
    console.error('Error validating transaction recipient:', error)
    return false
  }
}

/**
 * Get current SOL price for conversion (in USD)
 * For display purposes in dashboard
 */
export async function getSolPrice(): Promise<number> {
  try {
    // Use CoinGecko free API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    )
    const data = await response.json()
    return data.solana?.usd || 150 // Default to $150 if API fails
  } catch (error) {
    console.warn('Error fetching SOL price, using default:', error)
    return 150 // Default price fallback
  }
}
