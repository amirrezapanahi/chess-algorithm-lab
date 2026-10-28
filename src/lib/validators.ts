import type { Position, ValidationResult } from '../types/lab'

export const validPosition = (position: unknown, size: number): position is Position => {
  if (typeof position !== 'object' || position === null || Array.isArray(position)) return false
  const value = position as Record<string, unknown>
  return Number.isInteger(value.row) && Number.isInteger(value.col)
    && (value.row as number) >= 0 && (value.row as number) < size
    && (value.col as number) >= 0 && (value.col as number) < size
}

export const positionsFrom = (value: unknown, size: number): Position[] | null => {
  if (!Array.isArray(value) || !value.every((position) => validPosition(position, size))) return null
  return value
}

export function validateNonAttackingRooks(positions: unknown, size: number): ValidationResult {
  const parsed = positionsFrom(positions, size)
  if (!parsed) return { valid: false, message: 'Expected an array of { row, col } positions inside the board.' }
  if (parsed.length !== size) return { valid: false, message: `Expected ${size} rooks, received ${parsed.length}.` }
  const rows = new Set(parsed.map(({ row }) => row))
  const columns = new Set(parsed.map(({ col }) => col))
  if (rows.size !== size || columns.size !== size) {
    return { valid: false, message: 'Two or more rooks share a row or column.' }
  }
  return { valid: true, message: 'All rooks are in bounds and non-attacking.' }
}

export function validateNonAttackingQueens(positions: unknown, size: number): ValidationResult {
  const rookResult = validateNonAttackingRooks(positions, size)
  if (!rookResult.valid) return rookResult
  const parsed = positions as Position[]
  const diagonals = new Set<string>()
  for (const { row, col } of parsed) {
    const down = `d:${row - col}`
    const up = `u:${row + col}`
    if (diagonals.has(down) || diagonals.has(up)) {
      return { valid: false, message: 'Two or more queens share a diagonal.' }
    }
    diagonals.add(down)
    diagonals.add(up)
  }
  return { valid: true, message: 'All queens are in bounds and non-attacking.' }
}

export const knightMoves = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
] as const

export function isKnightStep(a: Position, b: Position): boolean {
  const row = Math.abs(a.row - b.row)
  const col = Math.abs(a.col - b.col)
  return (row === 2 && col === 1) || (row === 1 && col === 2)
}

export function shortestKnightDistance(size: number, start: Position, target: Position): number {
  const queue: Array<{ position: Position; distance: number }> = [{ position: start, distance: 0 }]
  const visited = new Set([`${start.row}:${start.col}`])
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor]
    if (!current) break
    if (current.position.row === target.row && current.position.col === target.col) return current.distance
    for (const [rowOffset, colOffset] of knightMoves) {
      const position = { row: current.position.row + rowOffset, col: current.position.col + colOffset }
      const key = `${position.row}:${position.col}`
      if (validPosition(position, size) && !visited.has(key)) {
        visited.add(key)
        queue.push({ position, distance: current.distance + 1 })
      }
    }
  }
  return -1
}
