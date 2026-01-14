import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { NoteElement } from '@/types'
import { X } from 'lucide-react'

interface StickyNoteProps {
    note: NoteElement
    isSelected: boolean
    onUpdate: (id: string, updates: Partial<NoteElement>) => void
    onDelete: (id: string) => void
    onSelect: (id: string) => void
}

/**
 * StickyNote Component
 *
 * A draggable, editable sticky note for the whiteboard.
 * Features: drag to move, click to edit text, delete button.
 */
export function StickyNote({
    note,
    isSelected,
    onUpdate,
    onDelete,
    onSelect,
}: StickyNoteProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-focus when editing starts
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus()
            textareaRef.current.select()
        }
    }, [isEditing])

    const handlePointerDown = (e: React.PointerEvent) => {
        if (isEditing) return

        e.stopPropagation()
        onSelect(note.id)

        setIsDragging(true)
        setDragStart({
            x: e.clientX - note.position.x,
            y: e.clientY - note.position.y,
        })

            ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return

        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y

        onUpdate(note.id, {
            position: { x: newX, y: newY },
        })
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false)
            ; (e.target as HTMLElement).releasePointerCapture(e.pointerId)
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    const handleBlur = () => {
        setIsEditing(false)
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate(note.id, { text: e.target.value })
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDelete(note.id)
    }

    return (
        <div
            className={cn(
                'absolute cursor-move select-none transition-shadow',
                'rounded-lg shadow-md hover:shadow-lg',
                isSelected && 'ring-2 ring-primary ring-offset-2',
                isDragging && 'shadow-xl scale-105'
            )}
            style={{
                left: note.position.x,
                top: note.position.y,
                width: note.width,
                height: note.height,
                backgroundColor: note.color,
                transform: isDragging ? 'rotate(2deg)' : 'rotate(0deg)',
                transition: isDragging ? 'none' : 'all 0.2s',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
        >
            {/* Delete button */}
            {isSelected && !isEditing && (
                <button
                    onClick={handleDelete}
                    className="absolute -top-2 -right-2 size-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md z-10"
                    aria-label="Delete note"
                >
                    <X className="size-4" />
                </button>
            )}

            {/* Note content */}
            <div className="w-full h-full p-3 overflow-hidden">
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={note.text}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        className="w-full h-full resize-none bg-transparent border-none outline-none font-handwriting"
                        style={{
                            fontSize: `${note.fontSize}px`,
                            color: '#000',
                        }}
                        placeholder="Type your note..."
                    />
                ) : (
                    <div
                        className="w-full h-full whitespace-pre-wrap break-words font-handwriting"
                        style={{
                            fontSize: `${note.fontSize}px`,
                            color: '#000',
                        }}
                    >
                        {note.text || 'Double-click to edit'}
                    </div>
                )}
            </div>
        </div>
    )
}
