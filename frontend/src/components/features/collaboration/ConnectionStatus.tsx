import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { useRoom } from '@/contexts/RoomContext'
import { cn } from '@/lib/utils'

interface ConnectionStatusProps {
    className?: string
    showLabel?: boolean
}

/**
 * ConnectionStatus Component
 *
 * Visual indicator for socket connection status.
 */
export function ConnectionStatus({
    className,
    showLabel = true,
}: ConnectionStatusProps) {
    const { connectionStatus } = useRoom()

    const getStatusConfig = () => {
        switch (connectionStatus) {
            case 'connected':
                return {
                    icon: <Wifi className="size-4" />,
                    label: 'Connected',
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10',
                }
            case 'connecting':
                return {
                    icon: <Loader2 className="size-4 animate-spin" />,
                    label: 'Connecting...',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-500/10',
                }
            case 'error':
                return {
                    icon: <WifiOff className="size-4" />,
                    label: 'Connection error',
                    color: 'text-destructive',
                    bgColor: 'bg-destructive/10',
                }
            default:
                return {
                    icon: <WifiOff className="size-4" />,
                    label: 'Disconnected',
                    color: 'text-muted-foreground',
                    bgColor: 'bg-muted',
                }
        }
    }

    const config = getStatusConfig()

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full',
                config.bgColor,
                config.color,
                className
            )}
            role="status"
            aria-label={`Connection status: ${config.label}`}
        >
            {config.icon}
            {showLabel && <span className="text-sm font-medium">{config.label}</span>}
        </div>
    )
}
