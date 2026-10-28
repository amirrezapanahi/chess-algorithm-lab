export type ExecutionMode = 'run' | 'test'

export interface ExecuteRequest {
  type: 'execute'
  requestId: string
  code: string
  input: Record<string, unknown>
  mode: ExecutionMode
  timeoutMs: number
  memoryLimitBytes: number
  maxEvents: number
}

export interface ExecutionPayload {
  result: unknown
  events: unknown[]
  logs: string[]
  truncated: boolean
  durationMs: number
}

export type WorkerResponse =
  | { type: 'started'; requestId: string }
  | { type: 'success'; requestId: string; payload: ExecutionPayload }
  | { type: 'error'; requestId: string; error: string; durationMs: number }

export function isExecuteRequest(value: unknown): value is ExecuteRequest {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const item = value as Record<string, unknown>
  return item.type === 'execute'
    && typeof item.requestId === 'string'
    && item.requestId.length <= 100
    && typeof item.code === 'string'
    && item.code.length <= 200_000
    && typeof item.input === 'object'
    && item.input !== null
    && !Array.isArray(item.input)
    && (item.mode === 'run' || item.mode === 'test')
    && typeof item.timeoutMs === 'number'
    && item.timeoutMs >= 100
    && item.timeoutMs <= 10_000
    && typeof item.memoryLimitBytes === 'number'
    && item.memoryLimitBytes >= 8 * 1024 * 1024
    && item.memoryLimitBytes <= 128 * 1024 * 1024
    && typeof item.maxEvents === 'number'
    && item.maxEvents >= 0
    && item.maxEvents <= 10_000
}

export function isWorkerResponse(value: unknown): value is WorkerResponse {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const item = value as Record<string, unknown>
  if (typeof item.type !== 'string' || typeof item.requestId !== 'string') return false
  if (item.type === 'started') return true
  if (item.type === 'error') return typeof item.error === 'string' && typeof item.durationMs === 'number'
  if (item.type !== 'success' || typeof item.payload !== 'object' || item.payload === null) return false
  const payload = item.payload as Record<string, unknown>
  return Array.isArray(payload.events)
    && Array.isArray(payload.logs)
    && payload.logs.every((log) => typeof log === 'string')
    && typeof payload.truncated === 'boolean'
    && typeof payload.durationMs === 'number'
}
