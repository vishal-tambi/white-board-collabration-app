import { useState, useEffect } from 'react'
import { motion, type Easing } from 'framer-motion'
import {
    ArrowRight,
    Sparkles,
    Zap,
    Users,
    Layers,
    Play,
    MousePointer2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { AnimatedMeshGradient } from './AnimatedMeshGradient'
import { FloatingParticles } from './FloatingParticles'
import { WhiteboardPreview } from './WhiteboardPreview'
import { generateRoomId } from '@/utils/roomId'

// Staggered animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.3,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as Easing,
        },
    },
}

const titleWordVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            duration: 0.8,
            delay: 0.4 + i * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94] as Easing,
        },
    }),
}

// Animated typing cursor
function TypewriterCursor() {
    return (
        <motion.span
            className="inline-block w-1 h-[1em] bg-primary ml-2 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
        />
    )
}

// Live collaboration indicator
function LiveIndicator() {
    return (
        <motion.div
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-success/10 border border-success/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
        >
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
            </span>
            <span className="text-sm font-medium text-success">2,847 people creating right now</span>
        </motion.div>
    )
}

// Animated feature cards that appear on load
function FeatureCards() {
    const features = [
        {
            icon: <MousePointer2 className="w-6 h-6" />,
            title: 'Real-time Cursors',
            desc: 'See everyone drawing live',
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            icon: <Layers className="w-6 h-6" />,
            title: 'Infinite Canvas',
            desc: 'No limits, endless space',
            color: 'text-secondary',
            bg: 'bg-secondary/10',
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Instant Sync',
            desc: 'Changes in milliseconds',
            color: 'text-accent',
            bg: 'bg-accent/10',
        },
    ]

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.15, delayChildren: 1.5 },
                },
            }}
        >
            {features.map((feature, i) => (
                <motion.div
                    key={feature.title}
                    className={`relative p-6 rounded-2xl ${feature.bg} border border-border/30 backdrop-blur-sm overflow-hidden group cursor-pointer`}
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { duration: 0.6, ease: 'easeOut' },
                        },
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`absolute inset-0 ${feature.bg} blur-xl`} />
                    </div>

                    <div className="relative z-10">
                        <div className={`${feature.color} mb-3`}>{feature.icon}</div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>

                    {/* Animated corner accent */}
                    <motion.div
                        className={`absolute -bottom-1 -right-1 w-16 h-16 ${feature.bg} rounded-tl-3xl`}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                </motion.div>
            ))}
        </motion.div>
    )
}

// Animated stats
function AnimatedStats() {
    const [counts, setCounts] = useState({ users: 0, boards: 0, countries: 0 })

    useEffect(() => {
        const timer = setTimeout(() => {
            const duration = 2000
            const steps = 60
            const interval = duration / steps

            let step = 0
            const counter = setInterval(() => {
                step++
                const progress = step / steps
                const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic

                setCounts({
                    users: Math.floor(50000 * eased),
                    boards: Math.floor(250000 * eased),
                    countries: Math.floor(120 * eased),
                })

                if (step >= steps) clearInterval(counter)
            }, interval)

            return () => clearInterval(counter)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
        >
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {counts.users.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {counts.boards.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Boards Created</div>
            </div>
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {counts.countries}+
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
            </div>
        </motion.div>
    )
}

export function Hero() {
    const navigate = useNavigate()

    // Handle creating a new room
    const handleCreateRoom = () => {
        const roomId = generateRoomId()
        navigate(`/room/${roomId}`)
    }

    const words = ['Where', 'Ideas', 'Come', 'Alive']

    return (
        <section className="relative min-h-screen overflow-hidden">
            <AnimatedMeshGradient />
            <FloatingParticles count={12} />

            {/* Hero glow orbs - optimized with reduced blur and GPU acceleration */}
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[50px] pointer-events-none will-change-transform"
                style={{ transform: 'translateZ(0)' }}
            />
            <div
                className="absolute top-1/3 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-[50px] pointer-events-none will-change-transform"
                style={{ transform: 'translateZ(0)' }}
            />

            <motion.div
                className="container mx-auto relative z-10 px-4 md:px-6 pt-8 md:pt-16 pb-16 flex flex-col items-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Top badges row */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-3 mb-8"
                    variants={itemVariants}
                >
                    {/* Version badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                        </span>
                        <span className="text-xs font-semibold tracking-widest uppercase">
                            Version 2.0
                        </span>
                        <Sparkles className="w-3 h-3" />
                    </div>

                    <LiveIndicator />
                </motion.div>

                {/* Main headline with 3D word animation */}
                <motion.h1
                    className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-center mb-6"
                    style={{ perspective: '1000px' }}
                >
                    {words.map((word, index) => (
                        <motion.span
                            key={word}
                            custom={index}
                            variants={titleWordVariants}
                            initial="hidden"
                            animate="visible"
                            className={`inline-block mr-3 md:mr-5 ${index === words.length - 1
                                ? 'gradient-text-animated'
                                : 'text-foreground'
                                }`}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {word}
                        </motion.span>
                    ))}
                    <TypewriterCursor />
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    className="text-center text-xl md:text-2xl lg:text-3xl font-medium text-foreground/80 max-w-3xl mx-auto mb-4"
                    variants={itemVariants}
                >
                    The collaborative whiteboard that{' '}
                    <span className="text-primary font-semibold">thinks like you do</span>
                </motion.p>

                {/* Description */}
                <motion.p
                    className="text-center text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
                    variants={itemVariants}
                >
                    Real-time sync, infinite canvas, and intelligent tools that make
                    brainstorming feel magical. No signup required.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12"
                    variants={itemVariants}
                >
                    <Button
                        size="lg"
                        className="h-14 px-10 text-lg rounded-full group bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 shadow-[0_0_40px_-10px_var(--color-primary)] hover:shadow-[0_0_60px_-10px_var(--color-primary)] cursor-pointer"
                        onClick={handleCreateRoom}
                    >
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Start Creating — It's Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-10 text-lg rounded-full border-2 hover:bg-muted/50 transition-all duration-300 backdrop-blur-sm"
                        asChild
                    >
                        <Link to="/join">
                            <Users className="mr-2 h-5 w-5" />
                            Join a Session
                        </Link>
                    </Button>
                </motion.div>

                {/* Feature cards */}
                <motion.div className="mb-12 w-full flex justify-center" variants={itemVariants}>
                    <FeatureCards />
                </motion.div>

                {/* Stats */}
                <motion.div className="mb-12" variants={itemVariants}>
                    <AnimatedStats />
                </motion.div>

                {/* 3D Whiteboard Preview */}
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                >
                    <WhiteboardPreview progress={1} />
                </motion.div>
            </motion.div>
        </section>
    )
}
