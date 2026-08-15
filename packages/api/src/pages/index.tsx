'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../components/ui/button'
import {  Card } from '../components/ui/card'
import { DarkModeToggle } from '../components/DarkModeToggle'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 8000)
    return () => clearInterval(interval)
  }, [isMounted])

  const slides = [
    {
      title: 'Instant Crypto Payments',
      description: 'Accept SOL and USDC instantly with zero friction',
      image: '/images/wings-hero.jpg',
    },
    {
      title: 'Powered by Blockchain',
      description: 'Transparent, secure, and decentralized transactions',
      image: '/images/blockchain-hero.jpg',
    },
    {
      title: 'Global Payments, Instantly',
      description: 'Send and receive payments anywhere in the world',
      image: '/images/world-map-hero.jpg',
    },
  ]

  const features = [
    { icon: '⚡', title: 'Instant', description: 'Payments settle in seconds' },
    { icon: '🔒', title: 'Secure', description: 'Cryptographically secured' },
    { icon: '💻', title: 'Developer Friendly', description: 'Simple API integration' },
    { icon: '📊', title: 'Real-time Analytics', description: 'Track all transactions' },
    { icon: '💰', title: 'Low Fees', description: 'Competitive pricing' },
    { icon: '🌍', title: 'Global', description: 'Available worldwide' },
  ]

  if (!isMounted) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center">
                B
              </div>
              <span className="hidden font-bold text-gray-900 dark:text-white sm:inline-block">
                Blew
              </span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Login
              </Link>
              <DarkModeToggle />
              <Button asChild size="sm">
                <Link href="/register">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative h-64 sm:h-80 md:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">{slide.title}</h2>
                  <p className="text-sm sm:text-lg md:text-xl text-gray-100 mb-4 sm:mb-8 max-w-2xl">{slide.description}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
            >
              →
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Why Choose Blew?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              The fastest way to accept crypto payments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-lg dark:hover:shadow-blue-500/20 transition-shadow hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
            Start Accepting Crypto Payments Today
          </h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Join thousands of merchants already using Blew
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Button asChild size="sm" className="sm:size-lg" variant="default">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild size="sm" className="sm:size-lg" variant="outline">
              <Link href="/login">Merchant Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Blew. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
