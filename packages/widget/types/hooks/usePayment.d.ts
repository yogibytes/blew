export interface PaymentRequest {
    id: string;
    amount: number;
    token: 'SOL' | 'USDC';
    status: 'pending' | 'confirmed' | 'failed';
    recipientPublicKey: string;
    expiresAt: string;
    metadata?: Record<string, any>;
    signature: string;
}
export interface UsePaymentReturn {
    payment: PaymentRequest | null;
    loading: boolean;
    error: Error | null;
    createPayment: (merchantId: string, amount: number, token: string, metadata?: Record<string, any>) => Promise<PaymentRequest>;
}
export declare const usePayment: (apiKey?: string) => UsePaymentReturn;
//# sourceMappingURL=usePayment.d.ts.map