'use client'

import { create } from 'zustand'
import { Payment, Token } from '@/types'

interface PaymentState {
  payment: Payment | null
  amount: string
  token: Token
  setPayment: (payment: Payment | null) => void
  setAmount: (amount: string) => void
  setToken: (token: Token) => void
  resetPayment: () => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payment: null,
  amount: '',
  token: 'SOL',
  setPayment: (payment: Payment | null) => set({ payment }),
  setAmount: (amount: string) => set({ amount }),
  setToken: (token: Token) => set({ token }),
  resetPayment: () => set({ payment: null, amount: '', token: 'SOL' }),
}))

export function usePayment() {
  return usePaymentStore()
}
