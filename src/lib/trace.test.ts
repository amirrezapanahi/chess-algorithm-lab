import { describe, expect, it } from 'vitest'
import { sanitizeTrace, stateAtStep, validateTraceEvent } from './trace'

describe('board setup trace events', () => {
  const pieces = [
    { row: 0, col: 0, piece: 'rook' as const, color: 'black' as const },
    { row: 7, col: 0, piece: 'rook' as const, color: 'white' as const },
  ]

  it('accepts a colored setup and applies it atomically', () => {
    const event = { type: 'setup' as const, pieces }
    expect(validateTraceEvent(event, 8)).toBe(true)
    const state = stateAtStep([event], 1, 'pawn')
    expect(state.pieces).toEqual(pieces)
  })

  it('rejects duplicate squares and unsupported colors', () => {
    expect(validateTraceEvent({ type: 'setup', pieces: [...pieces, pieces[0]] }, 8)).toBe(false)
    expect(validateTraceEvent({ type: 'place', row: 1, col: 1, piece: 'pawn', color: 'green' }, 8)).toBe(false)
    expect(sanitizeTrace([{ type: 'setup', pieces }, { type: 'setup', pieces: [...pieces, pieces[0]] }], 8)).toHaveLength(1)
  })
})
