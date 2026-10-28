import type { ExerciseDefinition } from '../types/lab'
import firstOpening from './first-opening'
import rookAttack from './rook-attack'
import nRooks from './n-rooks'
import nQueens from './n-queens'
import knightPath from './knight-path'

class ExerciseRegistry {
  readonly #exercises = new Map<string, ExerciseDefinition>()

  register(exercise: ExerciseDefinition): void {
    if (this.#exercises.has(exercise.id)) throw new Error(`Exercise "${exercise.id}" is already registered.`)
    this.#exercises.set(exercise.id, exercise)
  }

  get(id: string): ExerciseDefinition | undefined {
    return this.#exercises.get(id)
  }

  list(): ExerciseDefinition[] {
    return [...this.#exercises.values()]
  }
}

export const exerciseRegistry = new ExerciseRegistry()

for (const exercise of [firstOpening, rookAttack, nRooks, nQueens, knightPath]) {
  exerciseRegistry.register(exercise)
}

export { ExerciseRegistry }
