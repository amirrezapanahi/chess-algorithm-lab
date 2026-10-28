import type { ExerciseDefinition, TraceEvent } from '../../types/lab'
import { isKnightStep, positionsFrom, shortestKnightDistance, validPosition } from '../../lib/validators'

const readPath = (output: unknown): unknown => {
  if (Array.isArray(output)) return output
  if (typeof output === 'object' && output !== null && !Array.isArray(output)) return (output as Record<string, unknown>).path
  return null
}

const knightPath: ExerciseDefinition = {
  id: 'knight-path',
  slug: 'knight-shortest-path',
  title: { en: 'Knight Shortest Path', fa: 'کوتاه‌ترین مسیر اسب' },
  shortTitle: { en: 'Knight Path', fa: 'مسیر اسب' },
  description: {
    en: 'Use breadth-first search to find a shortest sequence of knight moves between two squares.',
    fa: 'با جست‌وجوی سطح‌اول، کوتاه‌ترین دنبالهٔ حرکت‌های اسب بین دو خانه را پیدا کنید.',
  },
  difficulty: 'intermediate',
  objectives: [
    { en: 'Model a board as an implicit graph.', fa: 'صفحه را به‌صورت یک گراف ضمنی مدل کنید.' },
    { en: 'Use a queue to explore positions by distance.', fa: 'با صف، موقعیت‌ها را بر اساس فاصله بررسی کنید.' },
    { en: 'Reconstruct a shortest path from parent links.', fa: 'با پیوندهای والد، کوتاه‌ترین مسیر را بازسازی کنید.' },
  ],
  concepts: [
    { en: 'Breadth-first search', fa: 'جست‌وجوی سطح‌اول' },
    { en: 'Queues', fa: 'صف‌ها' },
    { en: 'Shortest paths', fa: 'کوتاه‌ترین مسیرها' },
  ],
  inputSpec: { en: '{ size, start: {row, col}, target: {row, col} }.', fa: '{ size, start: {row, col}, target: {row, col} }.' },
  outputSpec: { en: '{ path: Position[] }, including both start and target.', fa: '{ path: Position[] } شامل خانهٔ آغاز و مقصد.' },
  constraints: [
    { en: '3 ≤ size ≤ 20', fa: '۳ ≤ اندازه ≤ ۲۰' },
    { en: 'Start and target are valid board positions.', fa: 'آغاز و مقصد، موقعیت‌های معتبر صفحه هستند.' },
  ],
  hints: [
    { en: 'Each square is a graph node with up to eight neighbors.', fa: 'هر خانه یک رأس گراف با حداکثر هشت همسایه است.' },
    { en: 'Mark a square visited when it enters the queue.', fa: 'خانه را هنگام ورود به صف بازدیدشده علامت بزنید.' },
    { en: 'Store each discovered square’s parent, then walk backward from the target.', fa: 'والد هر خانهٔ کشف‌شده را نگه دارید و از مقصد به عقب برگردید.' },
  ],
  starterCode: `function solve(input) {
  const { size, start, target } = input;
  const moves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  // TODO: run BFS, store parent links, and reconstruct the path.
  return { path: [] };
}

// Optional: yield { type: "visit", row, col } during BFS.
function* trace(input) {
  const result = solve(input);
  if (result.path.length) yield { type: "path", positions: result.path };
  yield { type: "complete", message: result.path.length ? "Path found" : "No path" };
}`,
  defaultInput: { size: 8, start: { row: 7, col: 1 }, target: { row: 0, col: 6 } },
  inputFields: [
    { type: 'number', key: 'size', label: { en: 'Board size', fa: 'اندازهٔ صفحه' }, min: 3, max: 20 },
    { type: 'position', key: 'start', label: { en: 'Start', fa: 'آغاز' } },
    { type: 'position', key: 'target', label: { en: 'Target', fa: 'مقصد' } },
  ],
  tests: [
    { id: 'same-square', name: { en: 'Already at target', fa: 'از ابتدا در مقصد' }, input: { size: 8, start: { row: 2, col: 2 }, target: { row: 2, col: 2 } } },
    { id: 'one-move', name: { en: 'One move', fa: 'یک حرکت' }, input: { size: 8, start: { row: 0, col: 0 }, target: { row: 2, col: 1 } } },
    { id: 'corner-to-corner', name: { en: 'Across the board', fa: 'دو سوی صفحه' }, input: { size: 8, start: { row: 0, col: 0 }, target: { row: 7, col: 7 } } },
    { id: 'unreachable', name: { en: 'Unreachable on a small board', fa: 'دست‌نیافتنی روی صفحهٔ کوچک' }, input: { size: 3, start: { row: 0, col: 0 }, target: { row: 1, col: 1 } } },
  ],
  piece: 'knight',
  getBoardSize: (input) => typeof input.size === 'number' ? input.size : 8,
  validate: (input, output) => {
    const size = typeof input.size === 'number' ? input.size : 0
    if (!validPosition(input.start, size) || !validPosition(input.target, size)) return { valid: false, message: 'Start or target is outside the board.' }
    const path = positionsFrom(readPath(output), size)
    if (!path) return { valid: false, message: 'Expected { path: Position[] }.' }
    const distance = shortestKnightDistance(size, input.start, input.target)
    if (distance === -1) {
      return path.length === 0
        ? { valid: true, message: 'Correct: the target is unreachable on this board.' }
        : { valid: false, message: 'The target is unreachable, so path must be empty.' }
    }
    if (path.length === 0) return { valid: false, message: 'Expected a non-empty path array.' }
    const first = path[0]
    const last = path[path.length - 1]
    if (!first || first.row !== input.start.row || first.col !== input.start.col) return { valid: false, message: 'The path must begin at start.' }
    if (!last || last.row !== input.target.row || last.col !== input.target.col) return { valid: false, message: 'The path must end at target.' }
    for (let index = 1; index < path.length; index += 1) {
      const previous = path[index - 1]
      const current = path[index]
      if (!previous || !current || !isKnightStep(previous, current)) return { valid: false, message: `Step ${index} is not a legal knight move.` }
    }
    if (path.length - 1 !== distance) return { valid: false, message: `The path is legal but not shortest. Expected ${distance} moves.` }
    return { valid: true, message: `Correct: shortest path uses ${distance} move${distance === 1 ? '' : 's'}.` }
  },
  resultToEvents: (input, output) => {
    const size = typeof input.size === 'number' ? input.size : 8
    const path = positionsFrom(readPath(output), size)
    if (!path) return []
    const events: TraceEvent[] = path.map((position) => ({ type: 'visit', ...position }))
    events.push({ type: 'path', positions: path })
    events.push({ type: 'place', ...path[path.length - 1]!, piece: 'knight' })
    events.push({ type: 'complete', message: `${Math.max(0, path.length - 1)} moves` })
    return events
  },
}

export default knightPath
