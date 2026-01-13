import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

const testimonials = [
    {
        author: "Alex Rivers",
        role: "Product Designer at Stripe",
        content: "The real-time latency is practically non-existent. It feels like we're in the same room even when we're continents apart.",
        avatar: "AR",
        direction: { x: -400, y: -200 }
    },
    {
        author: "Sarah Chen",
        role: "Engineering Lead at Vercel",
        content: "Finally, a whiteboard tool that doesn't feel clunky. The drawing experience is buttery smooth and the infinite canvas is a game changer.",
        avatar: "SC",
        direction: { x: 400, y: -150 }
    },
    {
        author: "David Park",
        role: "Founder at Startup",
        content: "We use this for everything from sprint planning to system architecture diagrams. It's become the central nervous system of our team.",
        avatar: "DP",
        direction: { x: -350, y: 200 }
    },
    {
        author: "Emily Watson",
        role: "Creative Director",
        content: "The clean aesthetic allows my team to focus on the ideas, not the tool. It just gets out of the way and lets us be creative.",
        avatar: "EW",
        direction: { x: 380, y: 180 }
    },
    {
        author: "Michael Torres",
        role: "CTO at FinTech",
        content: "Security and collaboration in one package. Our distributed team finally has a tool that matches how we actually work.",
        avatar: "MT",
        direction: { x: 0, y: -300 }
    },
    {
        author: "Lisa Zhang",
        role: "UX Researcher",
        content: "The intuitive design means zero onboarding time. Everyone on our team was productive from day one.",
        avatar: "LZ",
        direction: { x: 0, y: 280 }
    }
]

// Memoized testimonial card component for better performance
function TestimonialCard({
    testimonial,
    index,
    scrollYProgress
}: {
    testimonial: typeof testimonials[0]
    index: number
    scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
    // Pre-calculate animation ranges - extended for slower, smoother feel
    const staggerDelay = index * 0.05
    const animStart = 0.05 + staggerDelay
    const animEnd = 0.65 + staggerDelay

    const x = useTransform(scrollYProgress, [animStart, animEnd], [testimonial.direction.x, 0])
    const y = useTransform(scrollYProgress, [animStart, animEnd], [testimonial.direction.y, 0])
    const opacity = useTransform(scrollYProgress, [animStart, animEnd], [0, 1])

    return (
        <motion.div
            style={{ x, y, opacity }}
            className={cn(
                "relative p-6 md:p-8 rounded-2xl border bg-card shadow-xl",
                "transform-gpu will-change-transform",
                "hover:shadow-2xl hover:border-primary/30 transition-shadow duration-300"
            )}
        >
            <div className="flex flex-col h-full gap-4">
                <p className="text-base md:text-lg font-medium leading-relaxed flex-1 text-foreground/90">
                    "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-primary font-bold text-sm">
                        {testimonial.avatar}
                    </div>
                    <div>
                        <div className="font-semibold text-foreground text-sm">{testimonial.author}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export function TestimonialsSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    return (
        // Extended height container - user scrolls through this while section is sticky
        <section ref={containerRef} className="relative h-[200vh] bg-background">
            {/* Sticky wrapper that pins during scroll */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.h2
                        className="text-4xl md:text-6xl font-bold mb-16 text-center"
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                            y: useTransform(scrollYProgress, [0, 0.1], [50, 0])
                        }}
                    >
                        Loved by <span className="text-primary">innovators</span>
                    </motion.h2>

                    {/* Big Bang grid layout - optimized with memoized cards */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={index}
                                testimonial={testimonial}
                                index={index}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </div>

                    {/* Scroll hint at bottom - simplified animation */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50 text-sm flex flex-col items-center gap-2"
                        style={{
                            opacity: useTransform(scrollYProgress, [0.6, 0.8], [1, 0])
                        }}
                    >
                        <span>Scroll to continue</span>
                        <div className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-1">
                            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

