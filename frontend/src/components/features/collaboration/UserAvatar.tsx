import { cn } from '@/lib/utils'
import type { RoomUser } from '@/types'

interface UserAvatarProps {
  user: RoomUser
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'size-6 text-[10px]',
  md: 'size-8 text-xs',
  lg: 'size-10 text-sm',
}

/**
 * UserAvatar Component
 *
 * Displays user avatar with initials and color.
 * Used for showing room participants.
 */
export function UserAvatar({
  user,
  size = 'md',
  showName = false,
  className,
}: UserAvatarProps) {
  // Get initials (max 2 characters)
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium text-white shrink-0',
          sizeClasses[size]
        )}
        style={{ backgroundColor: user.color }}
        title={user.name}
        aria-label={user.name}
      >
        {initials}
      </div>
      {showName && (
        <span className="text-sm text-foreground truncate max-w-24">
          {user.name}
        </span>
      )}
    </div>
  )
}
