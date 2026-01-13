import { useState, useEffect, type FormEvent } from 'react'
import { motion, type Easing } from 'framer-motion'
import { ArrowLeft, ArrowRight, Users, Sparkles, PenLine, Link2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageLayout } from '@/components/layout/PageLayout'
import { isValidRoomId } from '@/utils/roomId'

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
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

const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.15, 1],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut' as Easing,
        },
    },
}

/**
 * JoinPage
 *
 * Allows users to join an existing whiteboard session by entering a room ID.
 */
export function JoinPage() {
    const navigate = useNavigate()
    const [roomId, setRoomId] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Clear error when room ID changes
    useEffect(() => {
        if (error) setError('')
    }, [roomId])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const trimmedRoomId = roomId.trim()

        if (!trimmedRoomId) {
            setError('Please enter a room ID')
            return
        }

        if (!isValidRoomId(trimmedRoomId)) {
            setError('Invalid room ID. Room IDs are 10 characters (letters, numbers, - and _)')
            return
        }

        setIsLoading(true)

        try {
            // Navigate to the room - the room will be auto-created if it doesn't exist
            navigate(`/room/${trimmedRoomId}`)
            toast.success('Joining room...', {
                description: `Room ID: ${trimmedRoomId}`,
            })
        } catch (err) {
            setError('Failed to join room. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <PageLayout>
            <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
                {/* Background gradient effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                {/* Animated glow orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary/15 rounded-full blur-[100px] pointer-events-none"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-secondary/15 rounded-full blur-[90px] pointer-events-none"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                    style={{ animationDelay: '1.5s' }}
                />

                <motion.div
                    className="relative z-10 w-full max-w-lg px-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Back button */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <Button
                            variant="ghost"
                            className="group gap-2 text-muted-foreground hover:text-foreground"
                            asChild
                        >
                            <Link to="/">
                                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Home
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Card container */}
                    <motion.div
                        variants={itemVariants}
                        className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl shadow-primary/5"
                    >
                        {/* Decorative corner accent */}
                        <div className="absolute -top-px -right-px w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent rounded-tr-3xl rounded-bl-[100px]" />

                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Users className="size-8 text-primary" />
                            </motion.div>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                                Join a Session
                            </h1>
                            <p className="text-muted-foreground">
                                Enter the room ID shared with you to collaborate
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="roomId"
                                    className="text-sm font-medium text-foreground flex items-center gap-2"
                                >
                                    <Link2 className="size-4 text-muted-foreground" />
                                    Room ID
                                </label>
                                <div className="relative">
                                    <Input
                                        id="roomId"
                                        type="text"
                                        placeholder="e.g., V1StGXR8_Z"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        className={`h-12 text-lg font-mono tracking-wider px-4 ${error ? 'border-destructive focus-visible:ring-destructive/20' : ''
                                            }`}
                                        autoComplete="off"
                                        autoFocus
                                        maxLength={10}
                                    />
                                    {roomId.length > 0 && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                                            {roomId.length}/10
                                        </span>
                                    )}
                                </div>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-destructive flex items-center gap-1.5"
                                    >
                                        <span className="size-1.5 rounded-full bg-destructive" />
                                        {error}
                                    </motion.p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={!roomId.trim() || isLoading}
                                className="w-full h-12 text-lg rounded-xl group bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            className="size-5 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join Session
                                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-card px-4 text-sm text-muted-foreground">
                                    or
                                </span>
                            </div>
                        </div>

                        {/* Create new room option */}
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">
                                Don't have a room ID?
                            </p>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-xl group border-2 hover:border-primary/50 transition-all duration-300"
                                asChild
                            >
                                <Link to="/">
                                    <PenLine className="size-4 mr-2 text-primary" />
                                    Create New Whiteboard
                                    <Sparkles className="size-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Tips */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-8 text-center text-sm text-muted-foreground"
                    >
                        <p>
                            💡 Tip: Ask your collaborator to share the room ID from their whiteboard header
                        </p>
                    </motion.div>
                </motion.div>
            </section>
        </PageLayout>
    )
}
