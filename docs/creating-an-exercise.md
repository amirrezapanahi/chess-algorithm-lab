# Creating an exercise

An exercise is a folder under `src/exercises/` containing an `index.ts` definition and, when useful, a `reference.ts` implementation for tests.

## 1. Implement the definition

Create `src/exercises/my-exercise/index.ts` and export an `ExerciseDefinition`:

```ts
import type { ExerciseDefinition } from '../../types/lab'

const exercise: ExerciseDefinition = {
  id: 'my-exercise',
  slug: 'my-exercise',
  title: { en: 'My exercise', fa: 'تمرین من' },
  shortTitle: { en: 'My exercise', fa: 'تمرین من' },
  description: { en: '…', fa: '…' },
  difficulty: 'beginner',
  objectives: [],
  concepts: [],
  inputSpec: { en: '…', fa: '…' },
  outputSpec: { en: '…', fa: '…' },
  constraints: [],
  hints: [],
  starterCode: 'function solve(input) { /* TODO */ }',
  defaultInput: { size: 8 },
  inputFields: [],
  tests: [],
  piece: 'rook',
  initialEvents: [], // Optional: render a position before the first run.
  getBoardSize: (input) => Number(input.size),
  validate: (input, output) => ({ valid: true, message: '…' }),
  resultToEvents: (input, output) => [],
}

export default exercise
```

Do not compare only against one hardcoded answer when multiple outputs are valid. Validate the mathematical properties of the returned object. Bound both inputs and retained result collections.

## 2. Register it

Import the module in `src/exercises/registry.ts` and add it to the registration array. No UI component should require an exercise-specific branch; add a reusable SDK field if the generic UI lacks a necessary capability.

## 3. Add tests

Test at least:

- one valid and one invalid output;
- bounds and malformed result handling;
- known counts or shortest distances when applicable;
- trace conversion and final visual state;
- duplicate registration behavior if registry behavior changes.

Keep reference implementations out of `starterCode`. Starters should teach the data shape and leave the central algorithm as a clear TODO.

## 4. Localize and verify

Every visible metadata string needs English and Persian text. Add Portuguese, French, Russian, and Arabic directly on `LocalizedText` or to `src/exercises/textTranslations.ts`; untranslated exercise text deliberately falls back to English. Code and identifiers stay LTR in every locale. Finish with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

For mixed-piece positions, use one validated `setup` event instead of dozens of `place` events:

```ts
{
  type: 'setup',
  pieces: [
    { row: 0, col: 4, piece: 'king', color: 'black' },
    { row: 7, col: 4, piece: 'king', color: 'white' },
  ],
}
```

Squares must be unique and inside the current board. Colors are optional and limited to `white` and `black`.
