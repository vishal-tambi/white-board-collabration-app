import { cn } from '@/lib/utils'

export const AnimatedMeshGradient = ({ className }: { className?: string }) => {
    return (
        <div className={cn('absolute inset-0 z-0 overflow-hidden bg-background', className)}>
            {/* Optimized blobs: reduced blur (60px), removed mix-blend-multiply, added GPU acceleration */}
            <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[60px] animate-mesh-blob will-change-transform" style={{ transform: 'translateZ(0)' }} />
            <div className="absolute top-[20%] right-[20%] w-[35vw] h-[35vw] bg-secondary/20 rounded-full blur-[60px] animate-mesh-blob animation-delay-2000 will-change-transform" style={{ transform: 'translateZ(0)' }} />
            <div className="absolute bottom-[20%] left-[30%] w-[45vw] h-[45vw] bg-accent/20 rounded-full blur-[60px] animate-mesh-blob animation-delay-4000 will-change-transform" style={{ transform: 'translateZ(0)' }} />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>
    )
}
