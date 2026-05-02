import React from 'react'
import { MerchantRegisterRequest } from '@blew/types'

export interface BlewWidgetProps {
  merchantId: string
  amount: number | string
  token?: 'SOL' | 'USDC'
  currency?: string
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  darkMode?: boolean
  metadata?: Record<string, any>
}

export const BlewWidget: React.FC<BlewWidgetProps> = ({
  merchantId,
  amount,
  token = 'SOL',
  currency = 'USD',
  onSuccess,
  onError,
  darkMode = false,
  metadata = {}
}) => {
  return (
    <div className={`blew-widget ${darkMode ? 'dark' : 'light'}`}>
      <button>Pay {amount} {token}</button>
    </div>
  )
}

export default BlewWidget
