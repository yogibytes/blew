'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Merchant } from '@blew/types'

interface MerchantState {
  merchant: Merchant | null
  apiKey: string | null
  isLoading: boolean
  setMerchant: (merchant: Merchant) => void
  setApiKey: (apiKey: string) => void
  clearMerchant: () => void
}

const useMerchantStore = create<MerchantState>()(
  persist(
    (set) => ({
      merchant: null,
      apiKey: null,
      isLoading: false,
      setMerchant: (merchant: Merchant) => set({ merchant }),
      setApiKey: (apiKey: string) => set({ apiKey }),
      clearMerchant: () => set({ merchant: null, apiKey: null }),
    }),
    {
      name: 'blew-merchant-storage',
      partialize: (state) => ({ merchant: state.merchant, apiKey: state.apiKey }),
    }
  )
)

export function useMerchant() {
  return useMerchantStore()
}