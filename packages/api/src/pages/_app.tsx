import React from 'react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app">
      <Component {...pageProps} />
    </div>
  )
}
