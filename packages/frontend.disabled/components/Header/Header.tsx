'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Common/Button'
import { Badge } from '@/components/Common/Badge'
import { ThemeToggle } from './ThemeToggle'
import { useMerchant } from '@/hooks/useMerchant'
import { formatters } from '@/utils/formatting'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { merchant, apiKey, clearMerchant } = useMerchant()
  const router = useRouter()

  const handleLogout = () => {
    clearMerchant()
    router.push('/')
  }

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="group flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center glow-box group-hover:glow-box-strong transition-all duration-300">
                B
              </div>
              <span className="hidden font-bold text-gray-900 dark:text-white sm:inline-block">
                Blew
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            {merchant && (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}
            <a
              href="https://docs.example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost">Docs</Button>
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {merchant ? (
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  {formatters.shortenAddress(apiKey || '', 8)}
                </Badge>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 dark:border-gray-700 md:hidden">
            <nav className="space-y-2">
              <Link href="/">
                <Button variant="ghost" fullWidth className="justify-start">
                  Home
                </Button>
              </Link>
              {merchant && (
                <Link href="/dashboard">
                  <Button variant="ghost" fullWidth className="justify-start">
                    Dashboard
                  </Button>
                </Link>
              )}
              <a
                href="https://docs.example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" fullWidth className="justify-start">
                  Docs
                </Button>
              </a>

              {merchant ? (
                <div className="space-y-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <Badge variant="accent" size="sm" className="inline-block">
                    {formatters.shortenAddress(apiKey || '', 8)}
                  </Badge>
                  <Button onClick={handleLogout} variant="secondary" fullWidth>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <Link href="/login" className="block">
                    <Button variant="secondary" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button variant="primary" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
