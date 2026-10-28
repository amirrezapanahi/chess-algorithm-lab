import type { BoardPiece, PieceColor, PieceKind, Position, TraceEvent } from '../types/lab'

const eventTypes = new Set([
  'setup', 'place', 'remove', 'visit', 'check', 'conflict', 'backtrack',
  'highlight', 'solution', 'path', 'complete',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isPosition(value: unknown, boardSize: number): value is Position {
  return isRecord(value)
    && Number.isInteger(value.row)
    && Number.isInteger(value.col)
    && (value.row as number) >= 0
    && (value.col as number) >= 0
    && (value.row as number) < boardSize
    && (value.col as number) < boardSize
}

function hasPosition(value: Record<string, unknown>, boardSize: number): boolean {
  return isPosition({ row: value.row, col: value.col }, boardSize)
}

function hasPositions(value: Record<string, unknown>, boardSize: number): boolean {
  return Array.isArray(value.positions)
    && value.positions.length <= boardSize * boardSize
    && value.positions.every((position) => isPosition(position, boardSize))
}

const pieceKinds: PieceKind[] = ['rook', 'queen', 'bishop', 'knight', 'king', 'pawn']
const pieceColors: PieceColor[] = ['white', 'black']

function isBoardPiece(value: unknown, boardSize: number): value is BoardPiece {
  return isRecord(value)
    && hasPosition(value, boardSize)
    && pieceKinds.includes(value.piece as PieceKind)
    && (value.color === undefined || pieceColors.includes(value.color as PieceColor))
    && (value.label === undefined || typeof value.label === 'string')
}

export function validateTraceEvent(value: unknown, boardSize: number): value is TraceEvent {
  if (!isRecord(value) || typeof value.type !== 'string' || !eventTypes.has(value.type)) return false

  switch (value.type) {
    case 'setup':
      return Array.isArray(value.pieces)
        && value.pieces.length <= boardSize * boardSize
        && value.pieces.every((piece) => isBoardPiece(piece, boardSize))
        && new Set(value.pieces.map((piece) => `${(piece as BoardPiece).row}:${(piece as BoardPiece).col}`)).size === value.pieces.length
    case 'place':
      return hasPosition(value, boardSize)
        && (value.piece === undefined || pieceKinds.includes(value.piece as PieceKind))
        && (value.color === undefined || pieceColors.includes(value.color as PieceColor))
        && (value.label === undefined || typeof value.label === 'string')
    case 'remove':
    case 'visit':
    case 'check':
    case 'backtrack':
      return hasPosition(value, boardSize)
    case 'conflict':
    case 'highlight':
    case 'solution':
    case 'path':
      return hasPositions(value, boardSize)
    case 'complete':
      return value.message === undefined || typeof value.message === 'string'
    default:
      return false
  }
}

export function sanitizeTrace(events: unknown, boardSize: number, limit = 5_000): TraceEvent[] {
  if (!Array.isArray(events)) return []
  const valid: TraceEvent[] = []
  for (const event of events.slice(0, limit)) {
    if (validateTraceEvent(event, boardSize)) valid.push(event)
  }
  return valid
}

export interface VisualPiece extends Position {
  piece: PieceKind
  color?: PieceColor
  label?: string
}

export interface VisualState {
  pieces: VisualPiece[]
  visited: Position[]
  checked: Position[]
  conflicts: Position[]
  highlighted: Position[]
  path: Position[]
  completed: boolean
  message?: string
  backtracks: number
}

export const emptyVisualState = (): VisualState => ({
  pieces: [],
  visited: [],
  checked: [],
  conflicts: [],
  highlighted: [],
  path: [],
  completed: false,
  backtracks: 0,
})

const sameSquare = (a: Position, b: Position) => a.row === b.row && a.col === b.col

export function applyTraceEvent(state: VisualState, event: TraceEvent, defaultPiece: PieceKind): VisualState {
  switch (event.type) {
    case 'setup':
      return { ...emptyVisualState(), pieces: event.pieces.map((piece) => ({ ...piece })) }
    case 'place':
      return {
        ...state,
        pieces: [
          ...state.pieces.filter((piece) => !sameSquare(piece, event)),
          { row: event.row, col: event.col, piece: event.piece ?? defaultPiece, color: event.color, label: event.label },
        ],
        checked: [],
        conflicts: [],
      }
    case 'remove':
      return { ...state, pieces: state.pieces.filter((piece) => !sameSquare(piece, event)) }
    case 'visit':
      return state.visited.some((square) => sameSquare(square, event))
        ? state
        : { ...state, visited: [...state.visited, event] }
    case 'check':
      return { ...state, checked: [event] }
    case 'conflict':
      return { ...state, conflicts: event.positions }
    case 'backtrack':
      return {
        ...state,
        pieces: state.pieces.filter((piece) => !sameSquare(piece, event)),
        conflicts: [],
        backtracks: state.backtracks + 1,
      }
    case 'highlight':
      return { ...state, highlighted: event.positions }
    case 'solution':
      return {
        ...state,
        pieces: event.positions.map((position) => ({ ...position, piece: event.piece ?? defaultPiece })),
        conflicts: [],
      }
    case 'path':
      return { ...state, path: event.positions, highlighted: event.positions }
    case 'complete':
      return { ...state, completed: true, message: event.message }
  }
}

export function stateAtStep(events: TraceEvent[], step: number, piece: PieceKind): VisualState {
  let state = emptyVisualState()
  for (let index = 0; index < Math.min(step, events.length); index += 1) {
    const event = events[index]
    if (event) state = applyTraceEvent(state, event, piece)
  }
  return state
}
