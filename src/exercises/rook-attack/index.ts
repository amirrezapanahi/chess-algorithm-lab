import type { ExerciseDefinition, Position, TraceEvent } from '../../types/lab'
import { validPosition } from '../../lib/validators'

const lineBetween = (a: Position, b: Position): Position[] => {
  const positions: Position[] = []
  if (a.row === b.row) {
    const [start, end] = a.col < b.col ? [a.col, b.col] : [b.col, a.col]
    for (let col = start; col <= end; col += 1) positions.push({ row: a.row, col })
  } else if (a.col === b.col) {
    const [start, end] = a.row < b.row ? [a.row, b.row] : [b.row, a.row]
    for (let row = start; row <= end; row += 1) positions.push({ row, col: a.col })
  }
  return positions
}

const rookAttack: ExerciseDefinition = {
  id: 'rook-attack',
  slug: 'rook-attack',
  title: { en: 'Rook Attack Detection', fa: 'تشخیص حملهٔ رخ' },
  shortTitle: { en: 'Rook Attack', fa: 'حملهٔ رخ' },
  description: {
    en: 'Determine whether two distinct rooks attack each other on an otherwise empty board.',
    fa: 'مشخص کنید آیا دو رخ متمایز در یک صفحهٔ خالی یکدیگر را تهدید می‌کنند یا نه.',
  },
  difficulty: 'beginner',
  objectives: [
    { en: 'Model positions with row and column coordinates.', fa: 'موقعیت‌ها را با مختصات سطر و ستون مدل کنید.' },
    { en: 'Translate chess movement rules into conditions.', fa: 'قواعد حرکت شطرنج را به شرط‌های منطقی تبدیل کنید.' },
  ],
  concepts: [
    { en: 'Coordinates', fa: 'مختصات' },
    { en: 'Conditional logic', fa: 'منطق شرطی' },
  ],
  inputSpec: {
    en: '{ size, rookA: {row, col}, rookB: {row, col} } using zero-based coordinates.',
    fa: '{ size, rookA: {row, col}, rookB: {row, col} } با مختصات شروع‌شونده از صفر.',
  },
  outputSpec: { en: 'Return true when the rooks attack; otherwise return false.', fa: 'اگر رخ‌ها همدیگر را تهدید می‌کنند true وگرنه false برگردانید.' },
  constraints: [
    { en: '2 ≤ size ≤ 20', fa: '۲ ≤ اندازه ≤ ۲۰' },
    { en: 'Both positions are distinct and inside the board.', fa: 'هر دو موقعیت متمایز و داخل صفحه هستند.' },
  ],
  hints: [
    { en: 'A rook moves along exactly one coordinate axis.', fa: 'رخ فقط در امتداد یکی از محورهای مختصات حرکت می‌کند.' },
    { en: 'Compare rows first, then compare columns.', fa: 'ابتدا سطرها و سپس ستون‌ها را مقایسه کنید.' },
  ],
  starterCode: `/**
 * Return true if the two rooks attack each other.
 * Coordinates are zero-based.
 */
function solve(input) {
  const { rookA, rookB } = input;
  // TODO: compare the row and column coordinates.
  return false;
}

// Optional: yield visualization events while explaining your logic.
function* trace(input) {
  const result = solve(input);
  yield { type: "place", ...input.rookA, piece: "rook", label: "A" };
  yield { type: "place", ...input.rookB, piece: "rook", label: "B" };
  yield { type: "complete", message: result ? "Attack detected" : "No attack" };
}`,
  defaultInput: { size: 8, rookA: { row: 2, col: 1 }, rookB: { row: 2, col: 6 } },
  inputFields: [
    { type: 'number', key: 'size', label: { en: 'Board size', fa: 'اندازهٔ صفحه' }, min: 2, max: 20 },
    { type: 'position', key: 'rookA', label: { en: 'Rook A', fa: 'رخ A' } },
    { type: 'position', key: 'rookB', label: { en: 'Rook B', fa: 'رخ B' } },
  ],
  tests: [
    { id: 'same-row', name: { en: 'Same row', fa: 'سطر یکسان' }, input: { size: 8, rookA: { row: 0, col: 0 }, rookB: { row: 0, col: 7 } } },
    { id: 'same-column', name: { en: 'Same column', fa: 'ستون یکسان' }, input: { size: 8, rookA: { row: 1, col: 3 }, rookB: { row: 6, col: 3 } } },
    { id: 'separate', name: { en: 'Different row and column', fa: 'سطر و ستون متفاوت' }, input: { size: 8, rookA: { row: 1, col: 2 }, rookB: { row: 6, col: 5 } } },
  ],
  piece: 'rook',
  getBoardSize: (input) => typeof input.size === 'number' ? input.size : 8,
  validate: (input, output) => {
    const size = typeof input.size === 'number' ? input.size : 0
    const rookA = input.rookA
    const rookB = input.rookB
    if (!validPosition(rookA, size) || !validPosition(rookB, size)) return { valid: false, message: 'The input positions are invalid.' }
    if (rookA.row === rookB.row && rookA.col === rookB.col) return { valid: false, message: 'The two rooks must occupy distinct squares.' }
    if (typeof output !== 'boolean') return { valid: false, message: 'solve() must return a boolean.' }
    const expected = rookA.row === rookB.row || rookA.col === rookB.col
    return output === expected
      ? { valid: true, message: expected ? 'Correct: the rooks share an attack line.' : 'Correct: the rooks do not share a row or column.' }
      : { valid: false, message: `Expected ${expected}, but solve() returned ${output}.` }
  },
  resultToEvents: (input, output) => {
    const size = typeof input.size === 'number' ? input.size : 8
    if (!validPosition(input.rookA, size) || !validPosition(input.rookB, size)) return []
    const a = input.rookA
    const b = input.rookB
    const events: TraceEvent[] = [
      { type: 'place', ...a, piece: 'rook', label: 'A' },
      { type: 'place', ...b, piece: 'rook', label: 'B' },
    ]
    if (output === true) events.push({ type: 'highlight', positions: lineBetween(a, b), tone: 'attack' })
    events.push({ type: 'complete', message: output === true ? 'Attack detected' : 'No attack' })
    return events
  },
}

export default rookAttack
