'use client'

import { useEffect, useState, ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Get initial theme preference
    const savedTheme = localStorage.getItem('blew-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
