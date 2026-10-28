import type { Position } from '../../types/lab'
import { knightMoves, validPosition } from '../../lib/validators'

export function solveKnightPath(size: number, start: Position, target: Position): { path: Position[] } {
  const queue: Position[] = [start]
  const parents = new Map<string, Position | null>([[`${start.row}:${start.col}`, null]])
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor]
    if (!current) break
    if (current.row === target.row && current.col === target.col) break
    for (const [rowOffset, colOffset] of knightMoves) {
      const next = { row: current.row + rowOffset, col: current.col + colOffset }
      const key = `${next.row}:${next.col}`
      if (validPosition(next, size) && !parents.has(key)) {
        parents.set(key, current)
        queue.push(next)
      }
    }
  }

  if (!parents.has(`${target.row}:${target.col}`)) return { path: [] }
  const path: Position[] = []
  let cursor: Position | null | undefined = target
  while (cursor) {
    path.push(cursor)
    cursor = parents.get(`${cursor.row}:${cursor.col}`)
  }
  return { path: path.reverse() }
}
