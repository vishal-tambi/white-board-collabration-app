import { useToolbarStore } from '@/stores/toolbarStore'
import { Slider } from '@/components/ui/slider'
import { STROKE_SIZES } from '@/types'

/**
 * SizeSlider Component
 *
 * Slider for adjusting stroke width.
 */
export function SizeSlider() {
  const { strokeSize, setSize } = useToolbarStore()

  return (
    <div className="px-3 py-2 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Size</span>
        <span className="font-mono tabular-nums">{strokeSize}px</span>
      </div>
      <Slider
        value={[strokeSize]}
        onValueChange={([value]) => setSize(value)}
        min={STROKE_SIZES.xs}
        max={STROKE_SIZES.xl}
        step={1}
        className="cursor-pointer"
        aria-label="Stroke size"
      />
      {/* Size preview */}
      <div className="flex justify-center pt-1">
        <div
          className="rounded-full bg-foreground transition-all"
          style={{
            width: strokeSize,
            height: strokeSize,
          }}
        />
      </div>
    </div>
  )
}
