import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Users, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isValidRoomId } from '@/utils/roomId'

/**
 * JoinRoomCard Component
 *
 * Card that allows users to join an existing whiteboard room.
 * Validates room ID format before navigation.
 */
export function JoinRoomCard() {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedId = roomId.trim()

    if (!trimmedId) {
      setError('Please enter a room ID')
      return
    }

    if (!isValidRoomId(trimmedId)) {
      setError('Invalid room ID format. Room IDs are 10 characters.')
      return
    }

    setIsJoining(true)

    // Simulate a brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300))

    navigate(`/room/${trimmedId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-colors">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 p-3 bg-secondary/10 rounded-xl w-fit">
            <Users className="size-6 text-secondary" />
          </div>
          <CardTitle className="text-xl">Join a Room</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm mb-6">
            Enter a room ID to join an existing session
          </p>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value)
                  setError('')
                }}
                className={error ? 'border-destructive' : ''}
                maxLength={10}
                aria-describedby={error ? 'room-id-error' : undefined}
                aria-invalid={error ? true : undefined}
              />
              {error && (
                <p
                  id="room-id-error"
                  className="mt-2 text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="size-4" />
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isJoining || !roomId.trim()}
              className="w-full cursor-pointer"
              size="lg"
              variant="secondary"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Room
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
