// Formatting utilities for numbers, dates, and addresses

export const formatters = {
  formatCurrency(value: number, token: 'SOL' | 'USDC' = 'SOL', decimals = 4): string {
    return `${value.toFixed(decimals)} ${token}`
  },

  formatUSD(value: number, decimals = 2): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  },

  formatNumber(value: number, decimals = 2): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  },

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  },

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  },

  shortenAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
  },

  formatPaymentId(id: string): string {
    return this.shortenAddress(id, 8)
  },

  formatPercentage(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`
  },
}
