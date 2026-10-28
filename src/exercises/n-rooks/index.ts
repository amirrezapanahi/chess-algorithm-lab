import type { ExerciseDefinition, Position, TraceEvent } from '../../types/lab'
import { validateNonAttackingRooks } from '../../lib/validators'

const factorial = (n: number): number => {
  let result = 1
  for (let value = 2; value <= n; value += 1) result *= value
  return result
}

const readOutput = (output: unknown): { placements: unknown[]; count: unknown } | null => {
  if (typeof output !== 'object' || output === null || Array.isArray(output)) return null
  const value = output as Record<string, unknown>
  return Array.isArray(value.placements) ? { placements: value.placements, count: value.count } : null
}

const nRooks: ExerciseDefinition = {
  id: 'n-rooks',
  slug: 'n-rooks',
  title: { en: 'N Rooks', fa: 'مسئلهٔ N رخ' },
  shortTitle: { en: 'N Rooks', fa: 'N رخ' },
  description: {
    en: 'Place N rooks on an N×N board so that no pair shares a row or column.',
    fa: 'N رخ را روی صفحهٔ N×N طوری قرار دهید که هیچ دو رخی در یک سطر یا ستون نباشند.',
  },
  difficulty: 'intermediate',
  objectives: [
    { en: 'Recognize permutations as valid rook placements.', fa: 'جایگشت‌ها را به‌عنوان چیدمان معتبر رخ‌ها بشناسید.' },
    { en: 'Use recursion without retaining unbounded output.', fa: 'از بازگشت بدون نگهداری خروجی نامحدود استفاده کنید.' },
  ],
  concepts: [
    { en: 'Permutations', fa: 'جایگشت‌ها' },
    { en: 'Recursion', fa: 'بازگشت' },
    { en: 'Constraints', fa: 'محدودیت‌ها' },
  ],
  inputSpec: { en: '{ n, maxSolutions } where only the first maxSolutions placements should be retained.', fa: '{ n, maxSolutions } که فقط نخستین maxSolutions چیدمان نگهداری می‌شود.' },
  outputSpec: { en: '{ placements: Position[][], count: number }. Count every solution, but retain only the requested number.', fa: '{ placements: Position[][], count: number }. همهٔ پاسخ‌ها را بشمارید ولی فقط تعداد درخواستی را نگه دارید.' },
  constraints: [
    { en: '1 ≤ n ≤ 8', fa: '۱ ≤ n ≤ ۸' },
    { en: '1 ≤ maxSolutions ≤ 20', fa: '۱ ≤ maxSolutions ≤ ۲۰' },
  ],
  hints: [
    { en: 'If each row gets one rook, only column conflicts remain.', fa: 'اگر در هر سطر یک رخ باشد، فقط تداخل ستون‌ها باقی می‌ماند.' },
    { en: 'A placement is a permutation of the column numbers.', fa: 'یک چیدمان، جایگشتی از شمارهٔ ستون‌هاست.' },
    { en: 'Increment count for every full permutation, even after the storage limit is reached.', fa: 'برای هر جایگشت کامل شمارنده را افزایش دهید، حتی پس از رسیدن به حد ذخیره.' },
  ],
  starterCode: `function solve(input) {
  const { n, maxSolutions } = input;
  const placements = [];
  let count = 0;

  function search(row, usedColumns, current) {
    // TODO: build one rook per row using an unused column.
  }

  search(0, new Set(), []);
  return { placements, count };
}

// Optional visualization. Yield place/remove events from your search.
function* trace(input) {
  const result = solve(input);
  if (result.placements[0]) {
    yield { type: "solution", positions: result.placements[0], piece: "rook" };
  }
  yield { type: "complete", message: result.count + " solutions" };
}`,
  defaultInput: { n: 4, maxSolutions: 4 },
  inputFields: [
    { type: 'number', key: 'n', label: { en: 'Board size (N)', fa: 'اندازهٔ صفحه (N)' }, min: 1, max: 8 },
    { type: 'number', key: 'maxSolutions', label: { en: 'Keep solutions', fa: 'تعداد پاسخ نگهداری‌شده' }, min: 1, max: 20 },
  ],
  tests: [
    { id: 'n1', name: { en: 'N = 1', fa: 'N = ۱' }, input: { n: 1, maxSolutions: 5 } },
    { id: 'n3', name: { en: 'N = 3', fa: 'N = ۳' }, input: { n: 3, maxSolutions: 6 } },
    { id: 'bounded-n4', name: { en: 'N = 4, bounded storage', fa: 'N = ۴، ذخیرهٔ محدود' }, input: { n: 4, maxSolutions: 3 } },
  ],
  piece: 'rook',
  getBoardSize: (input) => typeof input.n === 'number' ? input.n : 4,
  validate: (input, output) => {
    const n = typeof input.n === 'number' ? input.n : 0
    const maxSolutions = typeof input.maxSolutions === 'number' ? input.maxSolutions : 0
    const parsed = readOutput(output)
    if (!parsed) return { valid: false, message: 'Expected { placements: Position[][], count: number }.' }
    if (!Number.isInteger(parsed.count) || parsed.count !== factorial(n)) {
      return { valid: false, message: `Expected a total count of ${factorial(n)} solutions.` }
    }
    if (parsed.placements.length > maxSolutions) return { valid: false, message: `Retain at most ${maxSolutions} placements.` }
    if (parsed.placements.length !== Math.min(maxSolutions, factorial(n))) {
      return { valid: false, message: `Expected ${Math.min(maxSolutions, factorial(n))} retained placements.` }
    }
    const results = parsed.placements.map((placement) => validateNonAttackingRooks(placement, n))
    const invalid = results.find((result) => !result.valid)
    if (invalid) return invalid
    const serialized = parsed.placements.map((placement) => JSON.stringify(
      [...placement as Position[]].sort((a, b) => a.row - b.row || a.col - b.col),
    ))
    if (new Set(serialized).size !== serialized.length) return { valid: false, message: 'The retained placements must be unique.' }
    return { valid: true, message: `Correct: counted ${parsed.count} solutions and retained ${parsed.placements.length}.` }
  },
  resultToEvents: (_input, output) => {
    const parsed = readOutput(output)
    const first = parsed?.placements[0]
    if (!Array.isArray(first)) return []
    return [
      { type: 'solution', positions: first as Position[], piece: 'rook' },
      { type: 'complete', message: `${String(parsed?.count)} solutions` },
    ] satisfies TraceEvent[]
  },
}

export default nRooks
