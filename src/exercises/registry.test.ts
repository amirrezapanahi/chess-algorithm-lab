import { describe, expect, it } from 'vitest'
import type { ExerciseDefinition } from '../types/lab'
import { ExerciseRegistry } from './registry'
import rookAttack from './rook-attack'

describe('ExerciseRegistry', () => {
  it('rejects duplicate exercise IDs', () => {
    const registry = new ExerciseRegistry()
    registry.register(rookAttack)
    expect(() => registry.register({ ...rookAttack } as ExerciseDefinition)).toThrow(/already registered/)
  })
})
