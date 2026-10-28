import { describe, expect, it } from 'vitest'
import { solveKnightPath } from './knight-path/reference'
import { solveNQueens } from './n-queens/reference'
import { knownQueenCounts } from './n-queens'
import { solveNRooks } from './n-rooks/reference'
import { exerciseRegistry } from './registry'
import { simpleOpeningMoves, startingPieces } from './first-opening'
import { stateAtStep } from '../lib/trace'

describe('exercise collection', () => {
  it('registers all exercise modules with unique IDs', () => {
    const exercises = exerciseRegistry.list()
    expect(exercises).toHaveLength(5)
    expect(new Set(exercises.map(({ id }) => id)).size).toBe(5)
  })

  it('starts beginners with a complete board and validates the opening sequence', () => {
    const exercise = exerciseRegistry.get('first-opening')!
    expect(startingPieces).toHaveLength(32)
    expect(exercise.validate({}, [...simpleOpeningMoves]).valid).toBe(true)
    expect(exercise.validate({}, ['e2-e4']).valid).toBe(false)

    const initialEvents = exercise.initialEvents ?? []
    const initialState = stateAtStep(initialEvents, initialEvents.length, exercise.piece)
    expect(initialState.pieces).toHaveLength(32)
    expect(initialState.pieces.filter(({ color }) => color === 'white')).toHaveLength(16)
    expect(initialState.pieces.filter(({ color }) => color === 'black')).toHaveLength(16)

    const events = exercise.resultToEvents({}, [...simpleOpeningMoves])
    const finalState = stateAtStep(events, events.length, exercise.piece)
    expect(finalState.pieces).toHaveLength(32)
    expect(finalState.pieces).toContainEqual(expect.objectContaining({ row: 4, col: 4, piece: 'pawn', color: 'white' }))
    expect(finalState.pieces).toContainEqual(expect.objectContaining({ row: 2, col: 2, piece: 'knight', color: 'black' }))
    expect(finalState.completed).toBe(true)
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
