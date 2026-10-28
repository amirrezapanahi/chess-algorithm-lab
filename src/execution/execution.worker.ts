/// <reference lib="webworker" />
import RELEASE_SYNC from '@jitl/quickjs-wasmfile-release-sync'
import { newQuickJSWASMModuleFromVariant } from 'quickjs-emscripten-core'
import { isExecuteRequest, type WorkerResponse } from './messages'
import { buildSandboxProgram } from './sandboxProgram'

const scope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope
const quickJSPromise = newQuickJSWASMModuleFromVariant(RELEASE_SYNC)

const errorMessage = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    const error = value as Record<string, unknown>
    const name = typeof error.name === 'string' ? error.name : 'ExecutionError'
    const message = typeof error.message === 'string' ? error.message : JSON.stringify(error)
    const stack = typeof error.stack === 'string' ? error.stack : ''
    return `${name}: ${message}${stack ? `\n${stack}` : ''}`
  }
  return String(value)
}

scope.addEventListener('message', async (event: MessageEvent<unknown>) => {
  if (!isExecuteRequest(event.data)) return
  const request = event.data
  const module = await quickJSPromise
  const runtime = module.newRuntime()
  runtime.setMemoryLimit(request.memoryLimitBytes)
  runtime.setMaxStackSize(Math.min(2 * 1024 * 1024, Math.floor(request.memoryLimitBytes / 8)))
  const startedAt = performance.now()
  runtime.setInterruptHandler(() => performance.now() - startedAt > request.timeoutMs)
  const context = runtime.newContext()

  scope.postMessage({ type: 'started', requestId: request.requestId } satisfies WorkerResponse)

  try {
    const evaluation = context.evalCode(buildSandboxProgram(request), 'student-solution.js')
    if (evaluation.error) {
      const dumped = context.dump(evaluation.error)
      evaluation.error.dispose()
      const description = errorMessage(dumped)
      if (/\binterrupted\b/i.test(description)) {
        throw new Error(`Execution exceeded the ${request.timeoutMs} ms time limit.`)
      }
      if (/out of memory/i.test(description)) {
        throw new Error(`Execution exceeded the ${Math.round(request.memoryLimitBytes / 1024 / 1024)} MB memory limit.`)
      }
      throw new Error(description)
    }
    const dumped = context.dump(evaluation.value) as Record<string, unknown>
    evaluation.value.dispose()
    const response: WorkerResponse = {
      type: 'success',
      requestId: request.requestId,
      payload: {
        result: dumped.result,
        events: Array.isArray(dumped.events) ? dumped.events : [],
        logs: Array.isArray(dumped.logs) ? dumped.logs.filter((log): log is string => typeof log === 'string') : [],
        truncated: dumped.truncated === true,
        durationMs: Math.round((performance.now() - startedAt) * 10) / 10,
      },
    }
    scope.postMessage(response)
  } catch (error) {
    const response: WorkerResponse = {
      type: 'error',
      requestId: request.requestId,
      error: errorMessage(error instanceof Error ? error.message : error),
      durationMs: Math.round((performance.now() - startedAt) * 10) / 10,
    }
    scope.postMessage(response)
  } finally {
    context.dispose()
    runtime.dispose()
  }
})
