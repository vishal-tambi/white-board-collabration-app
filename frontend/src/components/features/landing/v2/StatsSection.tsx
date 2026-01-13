import { useRef, useEffect } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

const stats = [
    { label: "Active Users", value: 50000, suffix: "+" },
    { label: "Whiteboards Created", value: 120000, suffix: "+" },
    { label: "Updates / Second", value: 60, suffix: "fps" },
    { label: "Uptime", value: 99.9, suffix: "%", decimals: 1 }
]

export function StatsSection() {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/5 skew-y-3 transform origin-top-left scale-110" />

            <div className="container mx-auto relative z-10 px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <Counter key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function Counter({ label, value, suffix, decimals = 0 }: { label: string, value: number, suffix: string, decimals?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    const springValue = useSpring(0, {
        damping: 30,
        stiffness: 100,
        duration: 2
    })

    useEffect(() => {
        if (isInView) {
            springValue.set(value)
        }
    }, [isInView, value, springValue])

    const displayValue = useTransform(springValue, (current) => current.toFixed(decimals))

    return (
        <div ref={ref} className="text-center group">
            <motion.div
                className="text-4xl md:text-6xl font-bold tracking-tight text-foreground flex justify-center items-baseline gap-1"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.span>{displayValue}</motion.span>
                <span className="text-2xl md:text-4xl text-primary">{suffix}</span>
            </motion.div>
            <motion.p
                className="mt-2 text-sm md:text-base text-muted-foreground uppercase tracking-wider font-medium"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {label}
            </motion.p>
        </div>
    )
}
