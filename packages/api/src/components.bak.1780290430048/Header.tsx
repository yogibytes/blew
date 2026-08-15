'use client'

import React from 'react'
import { useTheme } from '../context/ThemeContext'

export const Header: React.FC = () => {
  const { theme, toggleTheme, themeConfig } = useTheme()
  const brandName = 'Blew'
  const tagline = 'Accept Crypto Payments'

  return (
    <header
      style={{
        backgroundColor: themeConfig.bg.primary,
        borderBottomColor: themeConfig.border.light,
        color: themeConfig.text.primary,
      }}
      className="border-b sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              style={{ color: themeConfig.accent.primary }}
              className="text-2xl sm:text-3xl font-bold shrink-0"
            >
              🌬️
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold truncate">{brandName}</h1>
              <p
                style={{ color: themeConfig.text.secondary }}
                className="text-xs sm:text-sm truncate"
              >
                {tagline}
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: themeConfig.bg.tertiary,
              color: themeConfig.accent.primary,
              borderColor: themeConfig.border.light,
            }}
            className="shrink-0 border rounded-lg p-2 sm:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm.707 5.657a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM9 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
