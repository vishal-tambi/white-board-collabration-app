import { motion, AnimatePresence } from 'framer-motion'
import { Image, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Snapshot {
    id: string
    dataUrl: string
    timestamp: number
    name?: string
}

interface SnapshotGalleryProps {
    snapshots: Snapshot[]
    onLoad?: (snapshot: Snapshot) => void
    onDelete?: (id: string) => void
    onDownload?: (snapshot: Snapshot) => void
    className?: string
}

/**
 * SnapshotGallery Component
 *
 * Grid gallery of saved canvas snapshots.
 * Allows viewing, loading, downloading, and deleting snapshots.
 */
export function SnapshotGallery({
    snapshots,
    onLoad,
    onDelete,
    onDownload,
    className,
}: SnapshotGalleryProps) {
    if (snapshots.length === 0) {
        return (
            <div className={cn('text-center py-8 text-muted-foreground', className)}>
                <Image className="size-12 mx-auto mb-4 opacity-50" />
                <p>No snapshots yet</p>
                <p className="text-sm">Save your canvas to see it here</p>
            </div>
        )
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Gallery grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence>
                    {snapshots.map((snapshot) => (
                        <motion.div
                            key={snapshot.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative group aspect-video bg-muted rounded-lg overflow-hidden border border-border"
                        >
                            <img
                                src={snapshot.dataUrl}
                                alt={
                                    snapshot.name ||
                                    `Snapshot from ${new Date(snapshot.timestamp).toLocaleString()}`
                                }
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {onLoad && (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onLoad(snapshot)}
                                        className="cursor-pointer"
                                    >
                                        Load
                                    </Button>
                                )}
                                {onDownload && (
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => onDownload(snapshot)}
                                        className="size-8 cursor-pointer"
                                    >
                                        <Download className="size-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => onDelete(snapshot.id)}
                                        className="size-8 cursor-pointer"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Timestamp */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-xs text-white truncate">
                                    {new Date(snapshot.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
