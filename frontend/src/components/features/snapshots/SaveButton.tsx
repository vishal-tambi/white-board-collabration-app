import { useState } from 'react'
import { Save, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  onSave: () => Promise<void> | void
  disabled?: boolean
  className?: string
}

/**
 * SaveButton Component
 *
 * Button with loading and success states for saving canvas.
 */
export function SaveButton({ onSave, disabled, className }: SaveButtonProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSave = async () => {
    if (status === 'saving') return

    setStatus('saving')

    try {
      await onSave()
      setStatus('saved')
      toast.success('Saved successfully!')

      // Reset to idle after a delay
      setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      setStatus('idle')
      toast.error('Failed to save', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="size-4 animate-spin" />
      case 'saved':
        return <Check className="size-4" />
      default:
        return <Save className="size-4" />
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return 'Saved!'
      default:
        return 'Save'
    }
  }

  return (
    <Button
      onClick={handleSave}
      disabled={disabled || status === 'saving'}
      className={cn(
        'cursor-pointer transition-colors',
        status === 'saved' && 'bg-green-500 hover:bg-green-500',
        className
      )}
      aria-label="Save canvas"
    >
      {getIcon()}
      <span className="ml-2">{getLabel()}</span>
    </Button>
  )
}
