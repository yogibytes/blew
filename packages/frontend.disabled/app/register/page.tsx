'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { useMerchant } from '@/hooks/useMerchant'

export default function RegisterPage() {
  const { setMerchant, setApiKey: saveMerchantApiKey } = useMerchant()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wallet: '',
  })
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const createAccount = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3000/api/merchants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          walletAddress: formData.wallet.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Registration failed')
      }

      if (data?.apiKey) {
        setApiKey(data.apiKey)
        saveMerchantApiKey(data.apiKey)
        setMerchant({
          id: data.id,
          email: data.email,
          name: data.name,
          apiKey: data.apiKey,
          walletAddress: data.walletAddress ?? formData.wallet.trim(),
          totalVolume: 0,
          transactionCount: 0,
          successRate: 0,
          createdAt: data.createdAt,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setError(errorMessage);
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createAccount()
  }

  if (apiKey) {
    return (
      <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center">
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

        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
                Account Created!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your API key has been generated
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 break-all font-mono text-sm">
              {apiKey}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Save your API key in a secure location. You won't be able to see it again.
            </p>

            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center">
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

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join Blew and start accepting payments
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Solana Wallet
              </label>
              <Input
                type="text"
                name="wallet"
                placeholder="Your Solana wallet address"
                value={formData.wallet}
                onChange={handleChange}
                required
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Login here
            </Link>
          </p>
        </Card>
      </main>
    </div>
  )
}
