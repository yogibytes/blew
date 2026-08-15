'use client'

import React, { useState } from 'react'
import { Button } from '@/components/Common/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Common/Card'
import { Input } from '@/components/Common/Input'
import { Badge } from '@/components/Common/Badge'
import { showSuccess, showError } from '@/components/Common/Toast'
import { useApi } from '@/hooks/useApi'
import { useMerchant } from '@/hooks/useMerchant'
import { validators } from '@/utils/validation'
import { RegisterRequest, RegisterResponse } from '@/types'

export interface RegisterFormProps {
  onSuccess?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    walletAddress: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showApiKey, setShowApiKey] = useState(false)
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null)

  const { execute, loading } = useApi<RegisterResponse>()
  const { setApiKey: storeApiKey, setMerchant } = useMerchant()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const emailError = validators.validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    const walletError = validators.validateSolanaAddress(formData.walletAddress)
    if (walletError) newErrors.walletAddress = walletError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const payload: RegisterRequest = {
        email: formData.email,
        name: formData.name,
        walletAddress: formData.walletAddress,
      }

      const response = await execute('/api/merchants/register', {
        method: 'POST',
        body: payload,
      })

      setGeneratedApiKey(response.apiKey)
      setShowApiKey(true)
      storeApiKey(response.apiKey)
      
      // Store merchant info
      setMerchant({
        id: response.id,
        email: response.email,
        name: response.name,
        apiKey: response.apiKey,
        walletAddress: formData.walletAddress,
        totalVolume: 0,
        transactionCount: 0,
        successRate: 100,
        createdAt: new Date().toISOString(),
      })

      showSuccess('Account created successfully!', 'Save your API key')
      
      if (onSuccess) {
        setTimeout(onSuccess, 1000)
      }
    } catch (error) {
      showError('Registration failed', error instanceof Error ? error.message : 'Please try again')
    }
  }

  const handleCopyApiKey = async () => {
    if (generatedApiKey) {
      await navigator.clipboard.writeText(generatedApiKey)
      showSuccess('API key copied to clipboard')
    }
  }

  if (showApiKey && generatedApiKey) {
    return (
      <Card className="animate-slideIn">
        <CardHeader>
          <CardTitle>Account Created Successfully</CardTitle>
          <CardDescription>Save your API key - you&apos;ll need it to authenticate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Your API Key</p>
            <code className="block break-all rounded bg-gray-900 p-3 text-sm text-white dark:bg-gray-800">
              {generatedApiKey}
            </code>
          </div>
          <Button onClick={handleCopyApiKey} variant="secondary" fullWidth>
            Copy API Key
          </Button>
          <Button onClick={() => onSuccess?.()} variant="primary" fullWidth>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-slideIn">
      <CardHeader>
        <CardTitle>Create Merchant Account</CardTitle>
        <CardDescription>Register to start accepting payments</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Business Name"
            type="text"
            placeholder="Your business name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <Input
            label="Solana Wallet Address"
            type="text"
            placeholder="Your SOL wallet address"
            value={formData.walletAddress}
            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
            error={errors.walletAddress}
          />

          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              Devnet
            </Badge>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              This is a test environment. Use devnet wallet addresses.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
