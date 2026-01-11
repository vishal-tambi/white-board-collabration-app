import { create } from 'zustand'
import type { ToolType } from '@/types'
import { TOOLBAR_DEFAULTS } from '@/types'

/**
 * Toolbar Store
 *
 * Manages the state of drawing tools, colors, and sizes.
 * Uses Zustand for efficient updates without React re-renders.
 */

interface ToolbarState {
  // Current active tool
  activeTool: ToolType
  // Current stroke color
  strokeColor: string
  // Current stroke size
  strokeSize: number

  // Actions
  setTool: (tool: ToolType) => void
  setColor: (color: string) => void
  setSize: (size: number) => void
  reset: () => void
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  // Initial state from defaults
  activeTool: TOOLBAR_DEFAULTS.tool,
  strokeColor: TOOLBAR_DEFAULTS.color,
  strokeSize: TOOLBAR_DEFAULTS.size,

  // Actions
  setTool: (tool) => set({ activeTool: tool }),
  setColor: (color) => set({ strokeColor: color }),
  setSize: (size) => set({ strokeSize: size }),
  reset: () =>
    set({
      activeTool: TOOLBAR_DEFAULTS.tool,
      strokeColor: TOOLBAR_DEFAULTS.color,
      strokeSize: TOOLBAR_DEFAULTS.size,
    }),
}))
