import { useEffect, useState, useRef, type RefObject } from 'react'

interface ScrollProgressOptions {
    offset?: [string, string] // e.g., ['start end', 'end start']
}

/**
 * Hook to track scroll progress relative to an element
 * Returns a value from 0 to 1 based on element's position in viewport
 */
export function useScrollProgress(
    ref: RefObject<HTMLElement | null>,
    options: ScrollProgressOptions = {}
): number {
    const [progress, setProgress] = useState(0)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const updateProgress = () => {
            const rect = element.getBoundingClientRect()
            const elementHeight = element.offsetHeight
            const viewportHeight = window.innerHeight

            // Calculate how far we've scrolled through the element
            // 0 = element just entered viewport from bottom
            // 1 = element has completely left viewport from top
            const scrollStart = viewportHeight - rect.top
            const scrollRange = elementHeight + viewportHeight

            let currentProgress = scrollStart / scrollRange
            currentProgress = Math.max(0, Math.min(1, currentProgress))

            setProgress(currentProgress)
        }

        const handleScroll = () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
            rafRef.current = requestAnimationFrame(updateProgress)
        }

        // Initial calculation
        updateProgress()

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [ref, options])

    return progress
}

/**
 * Maps a value from one range to another with clamping
 */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    const mapped = ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    return Math.max(Math.min(mapped, Math.max(outMin, outMax)), Math.min(outMin, outMax))
}
