/**
 * Tool Types
 *
 * Type definitions for the toolbar and tool-related functionality.
 */

/** All available tools including new shape and interaction tools */
export type ToolType =
  | 'pen'
  | 'eraser'
  | 'select'
  | 'pan'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'note'
  | 'laser'

/** Configuration for a single tool */
export interface ToolConfig {
  id: ToolType
  name: string
  icon: string
  shortcut: string
  cursor: string
}

/** Available preset colors for the color picker */
export const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
] as const

export type PresetColor = (typeof PRESET_COLORS)[number]

/** Available stroke sizes */
export const STROKE_SIZES = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
} as const

export type StrokeSize = (typeof STROKE_SIZES)[keyof typeof STROKE_SIZES]

/** Default values for toolbar state */
export const TOOLBAR_DEFAULTS = {
  tool: 'pen' as ToolType,
  color: '#000000',
  size: STROKE_SIZES.md,
}
