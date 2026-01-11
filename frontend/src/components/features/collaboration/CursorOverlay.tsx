import { useRoom } from '@/contexts/RoomContext'

/**
 * CursorOverlay Component
 *
 * Displays remote user cursors on the canvas.
 * Shows user name and colored cursor for each remote user.
 */
export function CursorOverlay() {
  const { users, remoteCursors } = useRoom()

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {users.map((user) => {
        const cursor = remoteCursors.get(user.id)
        if (!cursor) return null

        return (
          <div
            key={user.id}
            className="absolute transition-all duration-75 ease-out"
            style={{
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-2px, -2px)',
            }}
          >
            {/* Cursor pointer */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              <path
                d="M5.5 3.21V20.8C5.5 21.32 6.11 21.6 6.5 21.27L11.55 16.95L14.89 22.61C15.04 22.88 15.4 22.98 15.68 22.83L18.01 21.55C18.29 21.4 18.39 21.03 18.24 20.76L14.86 15H20.5C20.98 15 21.22 14.43 20.88 14.1L6.38 3.1C6.04 2.77 5.5 2.93 5.5 3.21Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            {/* User name label */}
            <div
              className="absolute left-4 top-4 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap shadow-md"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
