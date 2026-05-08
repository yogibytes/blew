// API wrapper configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://blew-ten.vercel.app'

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export const apiClient = {
  async fetch<T>(
    endpoint: string,
    options: FetchOptions = {},
    apiKey?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (apiKey) {
      headers['X-API-Key'] = apiKey
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(error.message || `API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error)
      throw error
    }
  },

  async get<T>(endpoint: string, apiKey?: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' }, apiKey)
  },

  async post<T>(endpoint: string, data?: unknown, apiKey?: string): Promise<T> {
    return this.fetch<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      apiKey
    )
  },

  async put<T>(endpoint: string, data?: unknown, apiKey?: string): Promise<T> {
    return this.fetch<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      apiKey
    )
  },
}
