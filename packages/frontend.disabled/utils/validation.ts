// Form validation utilities

export const validators = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidSolanaAddress(address: string): boolean {
    // Solana addresses are base58 encoded, 32-44 characters
    const base58Regex = /^[1-9A-HJ-NP-Z]{32,44}$/
    return base58Regex.test(address)
  },

  isValidApiKey(apiKey: string): boolean {
    // Simple validation: non-empty string
    return apiKey && apiKey.length > 0
  },

  isValidAmount(amount: string | number): boolean {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return !isNaN(num) && num > 0 && num <= 10000
  },

  isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  validateEmail(email: string): string | null {
    if (!email) return 'Email is required'
    if (!this.isValidEmail(email)) return 'Please enter a valid email address'
    return null
  },

  validatePassword(password: string): string | null {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  },

  validateSolanaAddress(address: string): string | null {
    if (!address) return 'Wallet address is required'
    if (!this.isValidSolanaAddress(address)) return 'Please enter a valid Solana address'
    return null
  },

  validateAmount(amount: string): string | null {
    if (!amount) return 'Amount is required'
    if (!this.isValidAmount(amount)) return 'Amount must be between 0.01 and 10,000'
    return null
  },

  validateApiKey(apiKey: string): string | null {
    if (!apiKey) return 'API key is required'
    if (!this.isValidApiKey(apiKey)) return 'Invalid API key format'
    return null
  },
}
