import { useState, useEffect } from 'react'

/**
 * A hook that delays setting a value until after a specified delay has passed
 * since the last time the value was updated.
 * Used for debouncing search inputs.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}
