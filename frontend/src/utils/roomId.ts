import { nanoid } from 'nanoid'

/**
 * Generate a unique room ID
 *
 * Uses nanoid with 10 characters for short, URL-friendly IDs
 * Example output: "V1StGXR8_Z"
 */
export function generateRoomId(): string {
  return nanoid(10)
}

/**
 * Validate a room ID format
 *
 * Room IDs should be:
 * - 10 characters long
 * - Only contain URL-safe characters (A-Za-z0-9_-)
 */
export function isValidRoomId(roomId: string): boolean {
  if (!roomId || roomId.length !== 10) return false
  // nanoid uses A-Za-z0-9_-
  return /^[A-Za-z0-9_-]{10}$/.test(roomId)
}

/**
 * Format room ID for display
 *
 * Adds visual separators for readability (groups of 5)
 * Example: "V1StG-XR8_Z" (not currently used, but available)
 */
export function formatRoomId(roomId: string): string {
  if (roomId.length <= 5) return roomId
  return `${roomId.slice(0, 5)}-${roomId.slice(5)}`
}
