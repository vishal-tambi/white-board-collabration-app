import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router'
import { toast } from 'sonner'
import { Canvas } from '@/components/features/whiteboard/Canvas'
import { Toolbar } from '@/components/features/whiteboard/Toolbar'
import { MobileToolbar } from '@/components/features/whiteboard/MobileToolbar'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useCanvasStore } from '@/stores/canvasStore'
import { useElementsStore } from '@/stores/elementsStore'
import { useToolbarStore } from '@/stores/toolbarStore'
import { useRoom } from '@/hooks/useRoom'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { downloadCanvas } from '@/utils/canvas'
import { PenLine, Copy, Check, Wifi, WifiOff, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * WhiteboardPage
 *
 * Main whiteboard canvas page with responsive toolbar and header.
 * Uses MobileToolbar on small screens, desktop Toolbar on larger screens.
 * Integrates with Socket.IO for real-time collaboration.
 */
export function WhiteboardPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const isMobile = useIsMobile()

  // Socket connection and room management
  const {
    status,
    users,
    currentUser,
    emitStrokeStart,
    emitStrokeUpdate,
    emitStrokeEnd,
    emitShapeStart,
    emitShapeUpdate,
    emitShapeEnd
  } = useRoom(roomId)

  const { undo, redo } = useCanvasStore()
  const { setTool } = useToolbarStore()

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }

      // Save: Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleDownload()
      }

      // Delete: Delete or Backspace (delete selected elements)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        const { deleteSelected } = useElementsStore.getState()
        deleteSelected()
      }

      // Tool shortcuts
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            setTool('pen')
            break
          case 'e':
            setTool('eraser')
            break
          case 'v':
            setTool('select')
            break
          case 'h':
            setTool('pan')
            break
          case 'r':
            setTool('rectangle')
            break
          case 'c':
            setTool('circle')
            break
          case 'a':
            setTool('arrow')
            break
          case 'l':
            setTool('line')
            break
          case 'n':
            setTool('note')
            break
          case 's':
            setTool('laser')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, setTool])

  // Handle download
  const handleDownload = useCallback(() => {
    const container = canvasContainerRef.current
    if (!container) return

    const canvas = container.querySelector('canvas')
    if (!canvas) return

    downloadCanvas(canvas, `whiteboard-${roomId}`)
    toast.success('Canvas saved!', {
      description: `Downloaded as whiteboard-${roomId}.png`,
    })
  }, [roomId])

  // Copy room ID to clipboard
  const copyRoomId = async () => {
    if (!roomId) return
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    toast.success('Room ID copied!', {
      description: roomId,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-background border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
          >
            <PenLine className="size-5 text-primary" />
            <span className="hidden sm:inline">Whiteboard</span>
          </Link>

          {/* Room ID */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">
              Room:
            </span>
            <code className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded max-w-[80px] sm:max-w-none truncate">
              {roomId}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer"
              onClick={copyRoomId}
              title="Copy room ID"
              aria-label="Copy room ID to clipboard"
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <div className="flex items-center gap-1.5 text-green-500" title="Connected">
                <Wifi className="size-4" />
                <span className="hidden sm:inline text-xs">{users.length} online</span>
              </div>
            ) : status === 'connecting' ? (
              <div className="flex items-center gap-1.5 text-yellow-500" title="Connecting...">
                <Wifi className="size-4 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-500" title="Disconnected">
                <WifiOff className="size-4" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* User indicator */}
          {currentUser && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${currentUser.color}20`, color: currentUser.color }}
            >
              <Users className="size-3" />
              <span className="hidden sm:inline">{currentUser.name}</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Desktop Toolbar - positioned on left */}
        {!isMobile && (
          <div className="absolute left-4 top-4 z-10">
            <Toolbar onDownload={handleDownload} />
          </div>
        )}

        {/* Canvas container */}
        <div
          ref={canvasContainerRef}
          className="flex-1 bg-white dark:bg-gray-900"
        >
          <Canvas
            onStrokeStart={emitStrokeStart}
            onStrokeUpdate={emitStrokeUpdate}
            onStrokeEnd={emitStrokeEnd}
            onShapeStart={emitShapeStart}
            onShapeUpdate={emitShapeUpdate}
            onShapeEnd={emitShapeEnd}
          />
        </div>

        {/* Mobile Toolbar - floating button + sheet */}
        {isMobile && <MobileToolbar onDownload={handleDownload} />}
      </main>
    </div>
  )
}

