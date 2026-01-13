import { cn } from '@/lib/utils'

export const AnimatedMeshGradient = ({ className }: { className?: string }) => {
    return (
        <div className={cn('absolute inset-0 z-0 overflow-hidden bg-background', className)}>
            <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-primary/30 rounded-full blur-[100px] animate-mesh-blob mix-blend-multiply filter" />
            <div className="absolute top-[20%] right-[20%] w-[35vw] h-[35vw] bg-secondary/30 rounded-full blur-[100px] animate-mesh-blob animation-delay-2000 mix-blend-multiply filter" />
            <div className="absolute bottom-[20%] left-[30%] w-[45vw] h-[45vw] bg-accent/30 rounded-full blur-[100px] animate-mesh-blob animation-delay-4000 mix-blend-multiply filter" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>
    )
}
