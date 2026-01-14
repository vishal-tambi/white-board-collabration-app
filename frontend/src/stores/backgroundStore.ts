import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BackgroundType } from '@/types'

/**
 * Background Store
 *
 * Manages the canvas background pattern preference.
 * Persists to localStorage for user preference.
 */

interface BackgroundState {
    backgroundType: BackgroundType
    setBackgroundType: (type: BackgroundType) => void
}

export const useBackgroundStore = create<BackgroundState>()(
    persist(
        (set) => ({
            backgroundType: 'none',
            setBackgroundType: (type) => set({ backgroundType: type }),
        }),
        {
            name: 'whiteboard-background',
        }
    )
)
