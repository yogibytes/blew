import { 
  Connection, 
  PublicKey, 
  Keypair, 
  SystemProgram, 
  Transaction, 
  sendAndConfirmTransaction, 
  clusterApiUrl 
} from '@solana/web3.js';

import bs58 from 'bs58';
export default function signatureInitiatorFunction(senderWalletAddress: String, MerchantWalletAddress: String, coin: String, amount: number) {

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');


}