'use client'

import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('blew-theme')
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark')
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', isDark)
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('blew-theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      return newTheme
    })
  }

  return {
    theme: mounted ? theme : 'light',
    toggleTheme,
    isDark: mounted && theme === 'dark',
  }
}
