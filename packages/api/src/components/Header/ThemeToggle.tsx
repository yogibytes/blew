'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <button
        className="rounded-full p-2 text-gray-600 dark:text-gray-400"
        aria-label="Loading theme toggle"
      >
        <div className="h-5 w-5" />
      </button>
    )
  }

  const handleToggle = () => {
    toggleTheme()
  }

  return (
    <button
      onClick={handleToggle}
      className="group relative rounded-full bg-gray-100 p-2 text-gray-700 transition-all duration-300 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-900"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon - Light Mode */}
      <svg
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.414 5.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z"
          clipRule="evenodd"
        />
      </svg>

      {/* Moon Icon - Dark Mode */}
      <svg
        className={`h-5 w-5 transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20 dark:bg-blue-400" />
    </button>
  )
}
