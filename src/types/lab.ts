export type Language = 'en' | 'fa' | 'pt' | 'fr' | 'ru' | 'ar'
export type Theme = 'light' | 'dark'

export interface LocalizedText {
  en: string
  fa: string
  pt?: string
  fr?: string
  ru?: string
  ar?: string
}

export interface Position {
  row: number
  col: number
}

export type PieceKind = 'rook' | 'queen' | 'bishop' | 'knight' | 'king' | 'pawn'

export type TraceEvent =
  | { type: 'place'; row: number; col: number; piece?: PieceKind; label?: string }
  | { type: 'remove'; row: number; col: number }
  | { type: 'visit'; row: number; col: number }
  | { type: 'check'; row: number; col: number }
  | { type: 'conflict'; positions: Position[] }
  | { type: 'backtrack'; row: number; col: number }
  | { type: 'highlight'; positions: Position[]; tone?: 'attack' | 'path' | 'candidate' }
  | { type: 'solution'; positions: Position[]; piece?: PieceKind }
  | { type: 'path'; positions: Position[] }
  | { type: 'complete'; message?: string }

export interface ValidationResult {
  valid: boolean
  message: string
  messageFa?: string
  details?: string[]
}

export interface ExerciseTest {
  id: string
  name: LocalizedText
  input: Record<string, unknown>
}

export type InputField =
  | {
      type: 'number'
      key: string
      label: LocalizedText
      min: number
      max: number
      step?: number
    }
  | {
      type: 'position'
      key: string
      label: LocalizedText
    }
  | {
      type: 'toggle'
      key: string
      label: LocalizedText
    }

export interface ExerciseDefinition {
  id: string
  slug: string
  title: LocalizedText
  shortTitle: LocalizedText
  description: LocalizedText
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  objectives: LocalizedText[]
  concepts: LocalizedText[]
  inputSpec: LocalizedText
  outputSpec: LocalizedText
  constraints: LocalizedText[]
  hints: LocalizedText[]
  starterCode: string
  defaultInput: Record<string, unknown>
  inputFields: InputField[]
  tests: ExerciseTest[]
  piece: PieceKind
  getBoardSize: (input: Record<string, unknown>) => number
  validate: (input: Record<string, unknown>, output: unknown) => ValidationResult
  resultToEvents: (input: Record<string, unknown>, output: unknown) => TraceEvent[]
}

export interface RunStats {
  durationMs: number
  steps: number
  recursiveCalls?: number
  backtracks?: number
}

export interface TestResult {
  id: string
  name: string
  passed: boolean
  message: string
  durationMs: number
}
