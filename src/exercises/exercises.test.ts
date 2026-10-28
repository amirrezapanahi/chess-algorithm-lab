import { describe, expect, it } from 'vitest'
import { solveKnightPath } from './knight-path/reference'
import { solveNQueens } from './n-queens/reference'
import { knownQueenCounts } from './n-queens'
import { solveNRooks } from './n-rooks/reference'
import { exerciseRegistry } from './registry'

describe('exercise collection', () => {
  it('registers all exercise modules with unique IDs', () => {
    const exercises = exerciseRegistry.list()
    expect(exercises).toHaveLength(4)
    expect(new Set(exercises.map(({ id }) => id)).size).toBe(4)
  })

  it('verifies known N Queens counts', () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
      expect(solveNQueens(n, 2).count).toBe(knownQueenCounts[n])
    }
  })

  it('retains bounded rook solutions while counting all permutations', () => {
    const result = solveNRooks(6, 3)
    expect(result.count).toBe(720)
    expect(result.placements).toHaveLength(3)
    expect(exerciseRegistry.get('n-rooks')?.validate({ n: 6, maxSolutions: 3 }, result).valid).toBe(true)
  })

  it('validates a reference knight shortest path', () => {
    const input = { size: 8, start: { row: 0, col: 0 }, target: { row: 7, col: 7 } }
    const output = solveKnightPath(input.size, input.start, input.target)
    expect(exerciseRegistry.get('knight-path')?.validate(input, output).valid).toBe(true)
  })

  it('accepts an empty path only when a small-board target is unreachable', () => {
    const input = { size: 3, start: { row: 0, col: 0 }, target: { row: 1, col: 1 } }
    const output = solveKnightPath(input.size, input.start, input.target)
    expect(output.path).toEqual([])
    expect(exerciseRegistry.get('knight-path')?.validate(input, output).valid).toBe(true)
  })
})
