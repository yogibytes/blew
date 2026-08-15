'use client'

import React, { useState } from 'react'
import { Button } from '@/components/Common/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Common/Card'
import { Input } from '@/components/Common/Input'
import { showSuccess, showError } from '@/components/Common/Toast'
import { useApi } from '@/hooks/useApi'
import { useMerchant } from '@/hooks/useMerchant'
import { validators } from '@/utils/validation'
import { LoginResponse } from '@/types'

export interface MerchantLoginProps {
  onSuccess?: () => void
}

export const MerchantLogin: React.FC<MerchantLoginProps> = ({ onSuccess }) => {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { execute, loading } = useApi<LoginResponse>()
  const { setApiKey: storeApiKey, setMerchant } = useMerchant()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const keyError = validators.validateApiKey(apiKey)
    if (keyError) {
      setError(keyError)
      return
    }

    try {
      const response = await execute('/api/merchants/me', {
        method: 'GET',
        apiKey,
      })

      storeApiKey(apiKey)
      setMerchant({
        id: response.id,
        email: response.email,
        name: response.name,
        apiKey,
        walletAddress: response.walletAddress,
        totalVolume: response.totalVolume || 0,
        transactionCount: response.transactionCount || 0,
        successRate: 100,
        createdAt: new Date().toISOString(),
      })

      showSuccess('Logged in successfully!', `Welcome back, ${response.name}`)
      
      if (onSuccess) {
        setTimeout(onSuccess, 1000)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid API key'
      setError(message)
      showError('Login failed', message)
    }
  }

  return (
    <Card className="animate-slideIn">
      <CardHeader>
        <CardTitle>Merchant Login</CardTitle>
        <CardDescription>Enter your API key to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="API Key"
            type="password"
            placeholder="Your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            error={error || undefined}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
