import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Plus, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateRoomId } from '@/utils/roomId'

/**
 * CreateRoomCard Component
 *
 * Card that allows users to create a new whiteboard room.
 * Generates a unique room ID and navigates to the room.
 */
export function CreateRoomCard() {
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRoom = async () => {
    setIsCreating(true)

    // Simulate a brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300))

    const roomId = generateRoomId()
    navigate(`/room/${roomId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-colors">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 p-3 bg-primary/10 rounded-xl w-fit">
            <Plus className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Create a Room</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm mb-6">
            Start a new whiteboard session and invite others to join
          </p>
          <Button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full cursor-pointer"
            size="lg"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create New Room
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
