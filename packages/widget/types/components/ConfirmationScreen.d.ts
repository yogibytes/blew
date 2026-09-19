import React from 'react';
interface ConfirmationScreenProps {
    paymentId: string;
    signature?: string;
    amount: number;
    token: string;
    onClose?: () => void;
    darkMode?: boolean;
}
export declare const ConfirmationScreen: React.FC<ConfirmationScreenProps>;
export {};
//# sourceMappingURL=ConfirmationScreen.d.ts.map