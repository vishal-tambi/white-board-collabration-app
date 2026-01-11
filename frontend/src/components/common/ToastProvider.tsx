import { Toaster } from '@/components/ui/sonner'
import type { ReactNode } from 'react'

interface ToastProviderProps {
  children: ReactNode
}

/**
 * ToastProvider Component
 *
 * Wraps the app with toast notification support using Sonner.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        toastOptions={{
          duration: 3000,
          className: 'font-sans',
        }}
      />
    </>
  )
}
