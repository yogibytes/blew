// TypeScript interfaces for Blew Payment Widget

export type Token = 'SOL' | 'USDC'
export type PaymentStatus = 'pending' | 'confirmed' | 'completed' | 'failed'

export interface Payment {
  id: string
  amount: number
  token: Token
  status: PaymentStatus
  recipientWallet: string
  solanaSignature?: string
  expiresAt: string
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface Merchant {
  id: string
  email: string
  name: string
  apiKey: string
  webhookUrl?: string
  webhookSecret?: string
  totalVolume: number
  transactionCount: number
  successRate: number
  walletAddress: string
  createdAt: string
}

export interface DashboardStats {
  volume: number
  transactions: number
  successRate: number
  avgTransaction: number
}

export interface ChartData {
  labels: string[]
  data: number[]
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

export interface PaymentRequest {
  amount: number
  token: Token
  recipientWallet: string
  metadata?: Record<string, unknown>
}

export interface RegisterRequest {
  email: string
  name: string
  walletAddress: string
}

export interface RegisterResponse {
  id: string
  apiKey: string
  email: string
  name: string
}

export interface LoginResponse {
  id: string
  email: string
  name: string
  walletAddress: string
  totalVolume: number
  transactionCount: number
}

export interface PaymentListResponse {
  payments: Payment[]
  total: number
  limit: number
  offset: number
}

export interface DashboardChartResponse {
  labels: string[]
  values: number[]
  range: '7days' | '30days' | '90days'
}
