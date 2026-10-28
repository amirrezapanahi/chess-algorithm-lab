import type { Position } from '../../types/lab'

export function solveNRooks(n: number, maxSolutions: number): { placements: Position[][]; count: number } {
  const placements: Position[][] = []
  let count = 0
  const used = new Set<number>()
  const current: Position[] = []
  const search = (row: number): void => {
    if (row === n) {
      count += 1
      if (placements.length < maxSolutions) placements.push(current.map((position) => ({ ...position })))
      return
    }
    for (let col = 0; col < n; col += 1) {
      if (used.has(col)) continue
      used.add(col)
      current.push({ row, col })
      search(row + 1)
      current.pop()
      used.delete(col)
    }
  }
  search(0)
  return { placements, count }
}
