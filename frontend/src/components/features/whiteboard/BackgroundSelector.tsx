import { Grid3x3, Grid2x2, AlignJustify, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useBackgroundStore } from '@/stores/backgroundStore'
import type { BackgroundType } from '@/types'

const backgroundOptions: {
    type: BackgroundType
    icon: React.ReactNode
    label: string
}[] = [
        {
            type: 'none',
            icon: <X className="size-4" />,
            label: 'None',
        },
        {
            type: 'dot',
            icon: <Grid2x2 className="size-4" />,
            label: 'Dots',
        },
        {
            type: 'grid',
            icon: <Grid3x3 className="size-4" />,
            label: 'Grid',
        },
        {
            type: 'lined',
            icon: <AlignJustify className="size-4" />,
            label: 'Lined',
        },
    ]

/**
 * BackgroundSelector Component
 *
 * Allows users to choose between different canvas background patterns.
 */
export function BackgroundSelector() {
    const { backgroundType, setBackgroundType } = useBackgroundStore()

    return (
        <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-1">
                Background
            </div>
            <div className="flex flex-wrap gap-1">
                <TooltipProvider delayDuration={300}>
                    {backgroundOptions.map((option) => (
                        <Tooltip key={option.type}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={
                                        backgroundType === option.type ? 'default' : 'ghost'
                                    }
                                    size="icon"
                                    className="size-9"
                                    onClick={() => setBackgroundType(option.type)}
                                    aria-label={`${option.label} background`}
                                >
                                    {option.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{option.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </div>
    )
}
