import { motion } from 'framer-motion'
import { MousePointer2, PenTool, Square, Type } from 'lucide-react'

interface WhiteboardPreviewProps {
    progress: number
}

export function WhiteboardPreview({ progress }: WhiteboardPreviewProps) {
    // Map progress to 3D transform values
    const rotateX = 15 - progress * 15
    const rotateY = -10 + progress * 10
    const scale = 0.85 + progress * 0.15
    const translateY = 60 - progress * 60

    return (
        <motion.div
            className="relative w-full max-w-4xl mx-auto perspective-1000"
            style={{
                transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translateY(${translateY}px)`,
                transformStyle: 'preserve-3d',
            }}
        >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl opacity-60" />

            {/* Main preview card */}
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                        <div className="w-3 h-3 rounded-full bg-warning/60" />
                        <div className="w-3 h-3 rounded-full bg-success/60" />
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-3 text-muted-foreground/60">
                        <MousePointer2 className="w-4 h-4" />
                        <PenTool className="w-4 h-4 text-primary" />
                        <Square className="w-4 h-4" />
                        <Type className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-primary/80 border-2 border-card" />
                            <div className="w-6 h-6 rounded-full bg-secondary/80 border-2 border-card" />
                            <div className="w-6 h-6 rounded-full bg-accent/80 border-2 border-card" />
                        </div>
                    </div>
                </div>

                {/* Canvas area */}
                <div className="relative h-64 md:h-80 bg-background/50 p-6">
                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, var(--border) 1px, transparent 1px),
                linear-gradient(to bottom, var(--border) 1px, transparent 1px)
              `,
                            backgroundSize: '24px 24px'
                        }}
                    />

                    {/* Animated stroke 1 */}
                    <motion.svg
                        className="absolute top-8 left-8 w-48 h-32"
                        viewBox="0 0 200 120"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: progress > 0.3 ? 1 : 0,
                            opacity: progress > 0.3 ? 1 : 0
                        }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                        <motion.path
                            d="M10 60 Q 50 10, 100 60 T 190 60"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress > 0.3 ? 1 : 0 }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                        />
                    </motion.svg>

                    {/* Shape */}
                    <motion.div
                        className="absolute top-16 right-16 w-20 h-20 border-2 border-secondary rounded-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: progress > 0.4 ? 1 : 0,
                            opacity: progress > 0.4 ? 1 : 0
                        }}
                        transition={{ duration: 0.5, ease: 'backOut', delay: 0.3 }}
                    />

                    {/* Circle */}
                    <motion.div
                        className="absolute bottom-12 left-1/3 w-16 h-16 border-2 border-accent rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: progress > 0.5 ? 1 : 0,
                            opacity: progress > 0.5 ? 1 : 0
                        }}
                        transition={{ duration: 0.5, ease: 'backOut', delay: 0.4 }}
                    />

                    {/* Text element */}
                    <motion.div
                        className="absolute bottom-8 right-8 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{
                            x: progress > 0.55 ? 0 : 20,
                            opacity: progress > 0.55 ? 1 : 0
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        Brainstorm 💡
                    </motion.div>

                    {/* Animated cursor */}
                    <motion.div
                        className="absolute flex items-start gap-1"
                        animate={{
                            x: [60, 180, 120, 200],
                            y: [40, 80, 140, 60],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <MousePointer2 className="w-4 h-4 text-secondary fill-secondary" />
                        <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">
                            Alex
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Reflection */}
            <div
                className="absolute inset-x-0 -bottom-px h-20 bg-gradient-to-t from-background via-background/80 to-transparent"
                style={{ transform: 'scaleY(-1)', opacity: 0.3 }}
            />
        </motion.div>
    )
}
