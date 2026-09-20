export interface MerchantRegisterRequest {
    name: string;
    email: string;
    walletAddress: string;
    webhookUrl?: string;
}
export interface MerchantResponse {
    id: string;
    email: string;
    name: string;
    walletAddress: string;
    apiKey: string;
    webhookSecret?: string;
    status: string;
    totalVolume: number;
    transactionCount: number;
    createdAt: string;
}
export interface PaymentCreateRequest {
    merchantId: string;
    amount: string | number;
    token: 'SOL' | 'USDC';
    currency?: string;
    metadata?: Record<string, any>;
}
export interface PaymentResponse {
    paymentId: string;
    publicKey: string;
    amount: string;
    token: 'SOL' | 'USDC';
    status: 'pending' | 'confirmed' | 'failed' | 'expired';
    expiresAt: string;
    explorerUrl?: string;
}
export interface PaymentConfirmRequest {
    signature: string;
    confirmed: boolean;
}
export interface WebhookPayload {
    paymentId: string;
    merchantId: string;
    amount: string;
    token: string;
    signature: string;
    status: string;
    customerWallet?: string;
    timestamp: string;
}
export interface Merchant {
    id: string;
    email: string;
    name: string;
    walletAddress: string;
    apiKey: string;
    webhookUrl?: string;
    webhookSecret?: string;
    status: string;
    totalVolume: number;
    transactionCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Payment {
    id: string;
    merchantId: string;
    amount: number;
    token: string;
    currency: string;
    solanaSignature?: string;
    customerWallet?: string;
    status: 'pending' | 'confirmed' | 'failed' | 'expired';
    metadata?: Record<string, any>;
    expiresAt: Date;
    createdAt: Date;
    confirmedAt?: Date;
}
export interface WebhookLog {
    id: string;
    paymentId: string;
    merchantId: string;
    url: string;
    status: 'pending' | 'delivered' | 'failed';
    payload: Record<string, any>;
    response?: string;
    errorMessage?: string;
    retryCount: number;
    maxRetries: number;
    nextRetry?: Date;
    createdAt: Date;
    lastAttemptAt?: Date;
}
export interface ErrorResponse {
    error: string;
    code: string;
    details?: Record<string, any>;
}
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'expired';
export type WebhookStatus = 'pending' | 'delivered' | 'failed';
export type MerchantStatus = 'active' | 'inactive' | 'suspended';
export type TokenType = 'SOL' | 'USDC';
//# sourceMappingURL=index.d.ts.map