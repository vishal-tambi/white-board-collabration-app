import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Monitor, Share2, Layers, PenTool, Lock, Zap } from 'lucide-react'

export function BentoGrid() {
    return (
        <section className="py-24 bg-background relative z-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Everything you need to <span className="text-primary">create</span>.
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Powerful features wrapped in a beautiful interface. Designed for teams who move fast.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <BentoCard
                        title="Real-time Synchronization"
                        description="See changes instantly. Sub-30ms latency for seamless collaboration across the globe."
                        icon={<Zap className="w-8 h-8 text-amber-500" />}
                        className="md:col-span-2 bg-gradient-to-br from-background to-amber-500/5"
                    />
                    <BentoCard
                        title="Infinite Canvas"
                        description="Never run out of space. Pan and zoom infinitely to map out your biggest ideas."
                        icon={<Layers className="w-8 h-8 text-blue-500" />}
                        className="bg-gradient-to-br from-background to-blue-500/5"
                    />
                    <BentoCard
                        title="Smart Drawing Tools"
                        description="Perfect shapes, auto-correction, and pressure sensitivity for a natural feel."
                        icon={<PenTool className="w-8 h-8 text-purple-500" />}
                        className="bg-gradient-to-br from-background to-purple-500/5"
                    />
                    <BentoCard
                        title="Secure by Default"
                        description="Enterprise-grade encryption for all your sessions and data."
                        icon={<Lock className="w-8 h-8 text-green-500" />}
                        className="md:col-span-2 bg-gradient-to-br from-background to-green-500/5"
                    />
                    <BentoCard
                        title="Multi-device Support"
                        description="Works perfectly on desktop, tablet, and mobile browsers."
                        icon={<Monitor className="w-8 h-8 text-primary" />}
                        className="bg-gradient-to-br from-background to-primary/5"
                    />
                    <BentoCard
                        title="Instant Sharing"
                        description="Share a link and start collaborating in seconds. No login required."
                        icon={<Share2 className="w-8 h-8 text-pink-500" />}
                        className="md:col-span-2 bg-gradient-to-br from-background to-pink-500/5"
                    />
                </div>
            </div>
        </section>
    )
}

function BentoCard({
    title,
    description,
    icon,
    className,
}: {
    title: string
    description: string
    icon: ReactNode
    className?: string
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={cn(
                'group relative rounded-3xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-xl overflow-hidden',
                'transform-gpu will-change-transform',
                className
            )}
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-background p-3 shadow-sm ring-1 ring-border group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2 group-hover:translate-x-1 transition-transform">
                    {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{description}</p>
            </div>

            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    )
}
