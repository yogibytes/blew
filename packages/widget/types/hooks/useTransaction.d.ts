export interface UseTransactionReturn {
    signature: string | null;
    confirmed: boolean;
    confirming: boolean;
    error: Error | null;
    submitTransaction: () => Promise<string>;
    pollForConfirmation: (signature: string, maxAttempts?: number) => Promise<boolean>;
}
export declare const useTransaction: () => {
    signature: string | null;
    confirmed: boolean;
    confirming: boolean;
    error: Error | null;
    submitTransaction: (merchantWalletAddress: string, amount: number) => Promise<string>;
    pollForConfirmation: (transactionSignature: string, maxAttempts?: number) => Promise<boolean>;
};
//# sourceMappingURL=useTransaction.d.ts.map