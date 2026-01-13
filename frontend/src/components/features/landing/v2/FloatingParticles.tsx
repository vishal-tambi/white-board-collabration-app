import { useMemo } from 'react'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    color: string
    duration: number
    delay: number
}

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--accent)']

function generateParticles(count: number): Particle[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: 20 + Math.random() * 20,
        delay: Math.random() * -15,
    }))
}

export function FloatingParticles({ count = 15 }: { count?: number }) {
    // Limit particles for performance
    const particles = useMemo(() => generateParticles(Math.min(count, 20)), [count])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full animate-float"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        opacity: 0.12,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}
        </div>
    )
}
