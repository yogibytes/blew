  import { 
    Connection, 
    PublicKey, 
    Keypair, 
    SystemProgram, 
    Transaction, 
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction, 
    clusterApiUrl 
  } from '@solana/web3.js';

  import bs58 from 'bs58';

  export default async function signatureInitiatorFunction(senderSecretKeyBase58: string, MerchantWalletAddress: string, token: string, amount: number){

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {

      const secretKeyUint8 = bs58.decode(senderSecretKeyBase58);

      const senderKeypair = Keypair.fromSecretKey(secretKeyUint8);
      // 2. Validate and initialize public keys
      
      const fromPubkey = senderKeypair.publicKey;
      
      const toPubkey = new PublicKey(MerchantWalletAddress);

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL, // Converts SOL amount to Lamports
      });
    
      const transaction = new Transaction().add(transferInstruction);
    
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair] // Signers array
      );
      console.log(`Transaction successful with signature: ${signature}`);
      return signature;

    } catch (error) {
      console.error("Transaction failed:", error);
      return null;
    }

  }