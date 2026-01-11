import { UserAvatar } from './UserAvatar'
import { useRoom } from '@/contexts/RoomContext'
import type { RoomUser } from '@/types'

interface UserPresenceProps {
  maxVisible?: number
}

/**
 * UserPresence Component
 *
 * Displays list of users in the current room.
 * Shows avatars with overflow count if many users.
 */
export function UserPresence({ maxVisible = 5 }: UserPresenceProps) {
  const { users, currentUser } = useRoom()

  // Combine current user with remote users
  const allUsers: RoomUser[] = currentUser ? [currentUser, ...users] : users

  if (allUsers.length === 0) {
    return null
  }

  const visibleUsers = allUsers.slice(0, maxVisible)
  const overflowCount = allUsers.length - maxVisible

  return (
    <div className="flex items-center">
      {/* Avatar stack */}
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <div
            key={user.id}
            className="relative ring-2 ring-background rounded-full"
            style={{ zIndex: visibleUsers.length - index }}
          >
            <UserAvatar user={user} size="sm" />
          </div>
        ))}

        {/* Overflow indicator */}
        {overflowCount > 0 && (
          <div
            className="relative size-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground ring-2 ring-background"
            style={{ zIndex: 0 }}
          >
            +{overflowCount}
          </div>
        )}
      </div>

      {/* User count label */}
      <span className="ml-3 text-sm text-muted-foreground hidden sm:inline">
        {allUsers.length} {allUsers.length === 1 ? 'user' : 'users'}
      </span>
    </div>
  )
}
