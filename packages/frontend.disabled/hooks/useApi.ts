'use client'

import { useState, useCallback } from 'react'
import { apiClient } from '@/utils/api'
import { ApiError } from '@/types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (
    endpoint: string,
    options?: { method?: string; body?: unknown; apiKey?: string }
  ): Promise<T> => {
    setState({ data: null, loading: true, error: null })

    try {
      let result: T

      if (options?.method === 'POST' || options?.method === 'PUT') {
        const method = options.method === 'PUT' ? 'put' : 'post'
        result = await apiClient[method]<T>(endpoint, options.body, options.apiKey)
      } else {
        result = await apiClient.get<T>(endpoint, options?.apiKey)
      }

      setState({ data: result, loading: false, error: null })
      return result
    } catch (err) {
      const error: ApiError = {
        message: err instanceof Error ? err.message : 'An error occurred',
      }
      setState({ data: null, loading: false, error })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
