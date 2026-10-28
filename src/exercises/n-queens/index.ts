import type { ExerciseDefinition, Position, TraceEvent } from '../../types/lab'
import { validateNonAttackingQueens } from '../../lib/validators'

export const knownQueenCounts: Record<number, number> = {
  1: 1,
  2: 0,
  3: 0,
  4: 2,
  5: 10,
  6: 4,
  7: 40,
  8: 92,
}

const readOutput = (output: unknown): { solutions: unknown[]; count: unknown } | null => {
  if (typeof output !== 'object' || output === null || Array.isArray(output)) return null
  const value = output as Record<string, unknown>
  return Array.isArray(value.solutions) ? { solutions: value.solutions, count: value.count } : null
}

const nQueens: ExerciseDefinition = {
  id: 'n-queens',
  slug: 'n-queens',
  title: { en: 'N Queens Backtracking', fa: 'عقب‌گرد N وزیر' },
  shortTitle: { en: 'N Queens', fa: 'N وزیر' },
  description: {
    en: 'Use recursive backtracking to place N queens so no two share a row, column, or diagonal.',
    fa: 'با عقب‌گرد بازگشتی، N وزیر را طوری بچینید که هیچ دو وزیری سطر، ستون یا قطر مشترک نداشته باشند.',
  },
  difficulty: 'advanced',
  objectives: [
    { en: 'Build and prune a constraint-search tree.', fa: 'درخت جست‌وجوی محدودیت را بسازید و هرس کنید.' },
    { en: 'Understand choices, conflicts, and backtracking.', fa: 'انتخاب، تعارض و عقب‌گرد را درک کنید.' },
    { en: 'Separate counting from bounded solution storage.', fa: 'شمارش را از ذخیرهٔ محدود پاسخ‌ها جدا کنید.' },
  ],
  concepts: [
    { en: 'Backtracking', fa: 'عقب‌گرد' },
    { en: 'Constraint satisfaction', fa: 'ارضای محدودیت' },
    { en: 'Search trees', fa: 'درخت‌های جست‌وجو' },
  ],
  inputSpec: { en: '{ n, maxSolutions } for an N×N board.', fa: '{ n, maxSolutions } برای صفحهٔ N×N.' },
  outputSpec: { en: '{ solutions: Position[][], count: number }. Count all solutions and retain at most maxSolutions.', fa: '{ solutions: Position[][], count: number }. همهٔ پاسخ‌ها را بشمارید و حداکثر maxSolutions پاسخ نگه دارید.' },
  constraints: [
    { en: '1 ≤ n ≤ 8', fa: '۱ ≤ n ≤ ۸' },
    { en: '1 ≤ maxSolutions ≤ 20', fa: '۱ ≤ maxSolutions ≤ ۲۰' },
  ],
  hints: [
    { en: 'Place exactly one queen in each row.', fa: 'در هر سطر دقیقاً یک وزیر قرار دهید.' },
    { en: 'Track columns, row − column, and row + column in sets.', fa: 'ستون‌ها، سطر−ستون و سطر+ستون را در مجموعه‌ها نگه دارید.' },
    { en: 'Undo every state change after returning from recursion.', fa: 'پس از بازگشت از فراخوانی بازگشتی، همهٔ تغییرات وضعیت را برگردانید.' },
  ],
  starterCode: `function solve(input) {
  const { n, maxSolutions } = input;
  const solutions = [];
  let count = 0;
  const columns = new Set();
  const diagonalDown = new Set(); // row - col
  const diagonalUp = new Set();   // row + col
  const current = [];

  function search(row) {
    // TODO: try each column, recurse on safe choices, then undo.
  }

  search(0);
  return { solutions, count };
}

// Optional: replace this with a generator that yields each search decision.
function* trace(input) {
  const result = solve(input);
  if (result.solutions[0]) {
    yield { type: "solution", positions: result.solutions[0], piece: "queen" };
  }
  yield { type: "complete", message: result.count + " solutions" };
}`,
  defaultInput: { n: 4, maxSolutions: 2 },
  inputFields: [
    { type: 'number', key: 'n', label: { en: 'Board size (N)', fa: 'اندازهٔ صفحه (N)' }, min: 1, max: 8 },
    { type: 'number', key: 'maxSolutions', label: { en: 'Keep solutions', fa: 'تعداد پاسخ نگهداری‌شده' }, min: 1, max: 20 },
  ],
  tests: [
    { id: 'n1', name: { en: 'N = 1', fa: 'N = ۱' }, input: { n: 1, maxSolutions: 2 } },
    { id: 'n2', name: { en: 'N = 2 has no solution', fa: 'N = ۲ بدون پاسخ' }, input: { n: 2, maxSolutions: 2 } },
    { id: 'n4', name: { en: 'N = 4 has two solutions', fa: 'N = ۴ دارای دو پاسخ' }, input: { n: 4, maxSolutions: 10 } },
  ],
  piece: 'queen',
  getBoardSize: (input) => typeof input.n === 'number' ? input.n : 4,
  validate: (input, output) => {
    const n = typeof input.n === 'number' ? input.n : 0
    const maxSolutions = typeof input.maxSolutions === 'number' ? input.maxSolutions : 0
    const expectedCount = knownQueenCounts[n]
    const parsed = readOutput(output)
    if (!parsed) return { valid: false, message: 'Expected { solutions: Position[][], count: number }.' }
    if (!Number.isInteger(parsed.count)) return { valid: false, message: 'count must be an integer.' }
    if (expectedCount !== undefined && parsed.count !== expectedCount) {
      return { valid: false, message: `Expected ${expectedCount} solutions for N = ${n}, received ${String(parsed.count)}.` }
    }
    if (parsed.solutions.length > maxSolutions) return { valid: false, message: `Retain at most ${maxSolutions} solutions.` }
    if (expectedCount !== undefined && parsed.solutions.length !== Math.min(maxSolutions, expectedCount)) {
      return { valid: false, message: `Expected ${Math.min(maxSolutions, expectedCount)} retained solutions.` }
    }
    for (const solution of parsed.solutions) {
      const result = validateNonAttackingQueens(solution, n)
      if (!result.valid) return result
    }
    const serialized = parsed.solutions.map((solution) => JSON.stringify(
      [...solution as Position[]].sort((a, b) => a.row - b.row || a.col - b.col),
    ))
    if (new Set(serialized).size !== serialized.length) return { valid: false, message: 'Solutions must be unique.' }
    return { valid: true, message: `Correct: found ${String(parsed.count)} valid solution${parsed.count === 1 ? '' : 's'}.` }
  },
  resultToEvents: (_input, output) => {
    const parsed = readOutput(output)
    const first = parsed?.solutions[0]
    const events: TraceEvent[] = []
    if (Array.isArray(first)) events.push({ type: 'solution', positions: first as Position[], piece: 'queen' })
    events.push({ type: 'complete', message: `${String(parsed?.count ?? 0)} solutions` })
    return events
  },
}

export default nQueens
