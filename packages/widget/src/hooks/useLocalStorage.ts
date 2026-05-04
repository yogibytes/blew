import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Update localStorage and state
  const setValue = useCallback(
    (value: T) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (err) {
        console.error(`Error saving to localStorage[${key}]:`, err)
      }
    },
    [key, storedValue]
  )

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      }
    } catch (err) {
      console.error(`Error reading from localStorage[${key}]:`, err)
    }
  }, [key])

  return [storedValue, setValue]
}
