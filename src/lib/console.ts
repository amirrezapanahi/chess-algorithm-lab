import type { RunStats, ValidationResult } from '../types/lab'

export interface ConsoleData {
  result?: unknown
  logs: string[]
  error?: string
  validation?: ValidationResult
  stats?: RunStats
  warnings: string[]
}

export const emptyConsoleData = (): ConsoleData => ({ logs: [], warnings: [] })
