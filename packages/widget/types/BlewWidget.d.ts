import React from 'react';
export interface BlewWidgetProps {
    merchantId: string;
    amount: number | string;
    token?: 'SOL' | 'USDC';
    currency?: string;
    onSuccess?: (data: {
        paymentId: string;
        signature?: string;
        amount: number;
        token: string;
    }) => void;
    onError?: (error: Error) => void;
    darkMode?: boolean;
    metadata?: Record<string, any>;
    apiKey?: string;
    apiBase?: string;
    style?: React.CSSProperties;
    className?: string;
}
export declare const BlewWidget: React.FC<BlewWidgetProps>;
export default BlewWidget;
//# sourceMappingURL=BlewWidget.d.ts.map