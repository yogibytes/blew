import React from 'react';
interface PaymentModalProps {
    merchantId: string;
    amount: number;
    token: 'SOL' | 'USDC';
    onPaymentCreated?: (paymentId: string) => void;
    onError?: (error: Error) => void;
    darkMode?: boolean;
    apiKey?: string;
    metadata?: Record<string, any>;
}
export declare const PaymentModal: React.FC<PaymentModalProps>;
export {};
//# sourceMappingURL=PaymentModal.d.ts.map