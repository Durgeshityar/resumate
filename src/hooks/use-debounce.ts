import { useEffect, useState } from 'react'

export default function useDebounce<T>(value: T, delay: number = 250) {
  const [debounceValue, setDebounceValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debounceValue
}
