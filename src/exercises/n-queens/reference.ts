import type { Position } from '../../types/lab'

export function solveNQueens(n: number, maxSolutions: number): { solutions: Position[][]; count: number } {
  const solutions: Position[][] = []
  let count = 0
  const columns = new Set<number>()
  const down = new Set<number>()
  const up = new Set<number>()
  const current: Position[] = []

  const search = (row: number): void => {
    if (row === n) {
      count += 1
      if (solutions.length < maxSolutions) solutions.push(current.map((position) => ({ ...position })))
      return
    }
    for (let col = 0; col < n; col += 1) {
      if (columns.has(col) || down.has(row - col) || up.has(row + col)) continue
      columns.add(col)
      down.add(row - col)
      up.add(row + col)
      current.push({ row, col })
      search(row + 1)
      current.pop()
      columns.delete(col)
      down.delete(row - col)
      up.delete(row + col)
    }
  }
  search(0)
  return { solutions, count }
}
