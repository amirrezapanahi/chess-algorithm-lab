import { describe, expect, it } from 'vitest'
import { isKnightStep, shortestKnightDistance, validateNonAttackingQueens, validateNonAttackingRooks } from './validators'

describe('placement validators', () => {
  it('accepts non-attacking rooks and rejects a shared column', () => {
    expect(validateNonAttackingRooks([{ row: 0, col: 2 }, { row: 1, col: 0 }, { row: 2, col: 1 }], 3).valid).toBe(true)
    expect(validateNonAttackingRooks([{ row: 0, col: 1 }, { row: 1, col: 1 }], 2).valid).toBe(false)
  })

  it('checks both diagonals for queens', () => {
    expect(validateNonAttackingQueens([{ row: 0, col: 1 }, { row: 1, col: 3 }, { row: 2, col: 0 }, { row: 3, col: 2 }], 4).valid).toBe(true)
    expect(validateNonAttackingQueens([{ row: 0, col: 0 }, { row: 1, col: 1 }], 2).valid).toBe(false)
  })
})

describe('knight validation', () => {
  it('recognizes legal knight steps', () => {
    expect(isKnightStep({ row: 0, col: 0 }, { row: 2, col: 1 })).toBe(true)
    expect(isKnightStep({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(false)
  })

  it('finds known shortest distances', () => {
    expect(shortestKnightDistance(8, { row: 0, col: 0 }, { row: 0, col: 0 })).toBe(0)
    expect(shortestKnightDistance(8, { row: 0, col: 0 }, { row: 7, col: 7 })).toBe(6)
  })
})
