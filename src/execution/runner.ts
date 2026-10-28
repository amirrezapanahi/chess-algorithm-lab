import type { ExecuteRequest, ExecutionMode, ExecutionPayload } from './messages'
import { isWorkerResponse } from './messages'

export interface RunOptions {
  code: string
  input: Record<string, unknown>
  mode?: ExecutionMode
  timeoutMs?: number
  memoryLimitBytes?: number
  maxEvents?: number
}

export interface ActiveExecution {
  promise: Promise<ExecutionPayload>
  cancel: () => void
}

export class ExecutionError extends Error {
  constructor(message: string, readonly kind: 'runtime' | 'timeout' | 'cancelled' | 'protocol' | 'initialization') {
    super(message)
    this.name = 'ExecutionError'
  }
}

export function executeStudentCode(options: RunOptions): ActiveExecution {
  const worker = new Worker(new URL('./execution.worker.ts', import.meta.url), { type: 'module' })
  const requestId = crypto.randomUUID()
  const timeoutMs = options.timeoutMs ?? 1_500
  const request: ExecuteRequest = {
    type: 'execute',
    requestId,
    code: options.code,
    input: options.input,
    mode: options.mode ?? 'run',
    timeoutMs,
    memoryLimitBytes: options.memoryLimitBytes ?? 64 * 1024 * 1024,
    maxEvents: options.maxEvents ?? 5_000,
  }
  let settled = false
  let executionTimer: ReturnType<typeof setTimeout> | undefined
  let initializationTimer: ReturnType<typeof setTimeout> | undefined
  let rejectPromise: ((reason: ExecutionError) => void) | undefined

  const cleanup = (): void => {
    if (executionTimer) clearTimeout(executionTimer)
    if (initializationTimer) clearTimeout(initializationTimer)
    worker.terminate()
  }

  const promise = new Promise<ExecutionPayload>((resolve, reject: (reason: ExecutionError) => void) => {
    rejectPromise = reject
    initializationTimer = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new ExecutionError('The QuickJS runtime did not initialize in time.', 'initialization'))
    }, 15_000)

    worker.addEventListener('message', (event: MessageEvent<unknown>) => {
      if (!isWorkerResponse(event.data) || event.data.requestId !== requestId || settled) return
      if (event.data.type === 'started') {
        if (initializationTimer) clearTimeout(initializationTimer)
        executionTimer = setTimeout(() => {
          if (settled) return
          settled = true
          cleanup()
          reject(new ExecutionError(`Execution exceeded the ${timeoutMs} ms time limit.`, 'timeout'))
        }, timeoutMs + 150)
        return
      }
      settled = true
      cleanup()
      if (event.data.type === 'error') reject(new ExecutionError(event.data.error, 'runtime'))
      else resolve(event.data.payload)
    })

    worker.addEventListener('error', (event) => {
      if (settled) return
      settled = true
      cleanup()
      reject(new ExecutionError(event.message || 'The execution worker failed.', 'protocol'))
    })

    worker.postMessage(request)
  })

  return {
    promise,
    cancel: () => {
      if (settled) return
      settled = true
      cleanup()
      rejectPromise?.(new ExecutionError('Execution cancelled.', 'cancelled'))
    },
  }
}
