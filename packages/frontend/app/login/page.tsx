'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { apiClient } from '@/utils/api'
import { useMerchant } from '@/hooks/useMerchant'
import { Merchant } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const { setMerchant, setApiKey: saveMerchantApiKey } = useMerchant()
  
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Call real API endpoint with X-API-Key header
      const merchantData = await apiClient.get<Merchant>(
        '/api/merchants/me',
        apiKey
      )

      if (merchantData.id) {
        // Save to Zustand store
        setMerchant(merchantData)
        saveMerchantApiKey(apiKey)
        
        // Redirect to dashboard
        router.push('/dashboard')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your API key and try again.'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center">
                B
              </div>
              <span className="hidden font-bold text-gray-900 dark:text-white sm:inline-block">
                Blew
              </span>
            </Link>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Merchant Login
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to your Blew account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                API Key *
              </label>
              <Input
                type="password"
                placeholder="Enter your API key (starts with pk_live_)"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setError(null)
                }}
                required
                disabled={loading}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Register here
            </Link>
          </p>

          <div className="mt-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}
