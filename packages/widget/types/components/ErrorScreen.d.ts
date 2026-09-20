import React from 'react';
interface ErrorScreenProps {
    error: string | Error;
    onRetry?: () => void;
    onClose?: () => void;
    darkMode?: boolean;
}
export declare const ErrorScreen: React.FC<ErrorScreenProps>;
export {};
//# sourceMappingURL=ErrorScreen.d.ts.map