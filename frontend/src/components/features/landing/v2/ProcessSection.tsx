import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

const steps = [
    {
        title: "Start a Session",
        description: "Create a room in one click. No sign-up required. Just instant collaboration.",
        color: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/20",
        image: "/process-start-session.png"
    },
    {
        title: "Invite Your Team",
        description: "Share the unique room link. Collaborators join instantly with zero friction.",
        color: "from-purple-500/20 to-pink-500/20",
        border: "border-purple-500/20",
        image: "/process-invite-team.png"
    },
    {
        title: "Create & Iterate",
        description: "Draw, sketch, and brainstorm on an infinite canvas with smart tools.",
        color: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/20",
        image: "/process-create-iterate.png"
    },
    {
        title: "Save & Export",
        description: "Capture snapshots of your work or export high-res images for your report.",
        color: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/20",
        image: "/process-save-export.png"
    }
]

export function ProcessSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-background">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)/.05,transparent_70%)]" />

                <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center tracking-tight">
                        How it <span className="text-primary">works</span>
                    </h2>

                    <div className="relative w-full max-w-4xl aspect-video bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {steps.map((step, index) => {
                            const rangeStart = index * (1 / steps.length)
                            const rangeEnd = (index + 1) * (1 / steps.length)

                            // Fade in/out based on scroll position
                            const opacity = useTransform(
                                scrollYProgress,
                                [rangeStart, rangeStart + 0.1, rangeEnd - 0.1, rangeEnd],
                                [0, 1, 1, 0]
                            )

                            const scale = useTransform(
                                scrollYProgress,
                                [rangeStart, rangeStart + 0.1, rangeEnd - 0.1, rangeEnd],
                                [0.8, 1, 1, 0.8]
                            )

                            return (
                                <motion.div
                                    key={index}
                                    style={{ opacity, scale }}
                                    className={cn(
                                        "absolute inset-0 flex flex-row items-center justify-between p-8",
                                        "bg-gradient-to-br", step.color
                                    )}
                                >
                                    {/* Left side - Text content */}
                                    <div className="flex flex-col items-start text-left max-w-md">
                                        <span className={cn(
                                            "text-sm font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full",
                                            step.border, "bg-background/50"
                                        )}>
                                            Step {index + 1}
                                        </span>
                                        <h3 className="text-3xl md:text-5xl font-bold mb-4">{step.title}</h3>
                                        <p className="text-lg md:text-xl text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Right side - Image */}
                                    <div className="hidden md:flex items-center justify-center w-1/2">
                                        <motion.img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full max-w-xs h-auto object-contain rounded-2xl shadow-lg"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Progress indicators */}
                    <div className="flex gap-4 mt-8">
                        {steps.map((_, index) => (
                            <motion.div
                                key={index}
                                style={{
                                    opacity: useTransform(
                                        scrollYProgress,
                                        [(index * 1 / steps.length), (index * 1 / steps.length) + 0.1],
                                        [0.3, 1]
                                    )
                                }}
                                className="w-3 h-3 rounded-full bg-primary"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
