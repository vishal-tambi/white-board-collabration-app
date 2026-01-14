import type { BackgroundType } from '@/types'

interface BackgroundPatternProps {
    type: BackgroundType
    zoom?: number
}

/**
 * BackgroundPattern Component
 *
 * Renders SVG background patterns for the canvas.
 * Patterns scale with zoom level to maintain visual consistency.
 */
export function BackgroundPattern({ type, zoom = 1 }: BackgroundPatternProps) {
    if (type === 'none') return null

    // Adjust pattern size based on zoom
    const baseSize = 20
    const size = baseSize * zoom

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        >
            <defs>
                {/* Dot pattern */}
                {type === 'dot' && (
                    <pattern
                        id="dot-pattern"
                        width={size}
                        height={size}
                        patternUnits="userSpaceOnUse"
                    >
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={1 * zoom}
                            fill="currentColor"
                            className="text-muted-foreground/20"
                        />
                    </pattern>
                )}

                {/* Grid pattern */}
                {type === 'grid' && (
                    <pattern
                        id="grid-pattern"
                        width={size}
                        height={size}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={`M ${size} 0 L 0 0 0 ${size}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={0.5 * zoom}
                            className="text-muted-foreground/20"
                        />
                    </pattern>
                )}

                {/* Lined paper pattern */}
                {type === 'lined' && (
                    <pattern
                        id="lined-pattern"
                        width={size * 2}
                        height={size}
                        patternUnits="userSpaceOnUse"
                    >
                        <line
                            x1={0}
                            y1={size}
                            x2={size * 2}
                            y2={size}
                            stroke="currentColor"
                            strokeWidth={0.5 * zoom}
                            className="text-muted-foreground/20"
                        />
                    </pattern>
                )}
            </defs>

            {/* Apply the pattern */}
            <rect
                width="100%"
                height="100%"
                fill={`url(#${type}-pattern)`}
            />
        </svg>
    )
}
