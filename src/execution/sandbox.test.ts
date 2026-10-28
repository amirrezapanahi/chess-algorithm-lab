import { beforeAll, describe, expect, it } from 'vitest'
import RELEASE_SYNC from '@jitl/quickjs-wasmfile-release-sync'
import { newQuickJSWASMModuleFromVariant, type QuickJSWASMModule } from 'quickjs-emscripten-core'
import { exerciseRegistry } from '../exercises/registry'
import { sanitizeTrace, stateAtStep } from '../lib/trace'
import type { ExecuteRequest } from './messages'
import { buildSandboxProgram } from './sandboxProgram'

let quickJS: QuickJSWASMModule

beforeAll(async () => {
  quickJS = await newQuickJSWASMModuleFromVariant(RELEASE_SYNC)
})

function request(code: string, input: Record<string, unknown>, mode: 'run' | 'test' = 'run'): ExecuteRequest {
  return {
    type: 'execute',
    requestId: 'test',
    code,
    input,
    mode,
    timeoutMs: 1_000,
    memoryLimitBytes: 32 * 1024 * 1024,
    maxEvents: 100,
  }
}

function evaluate(source: string, input: Record<string, unknown>, mode: 'run' | 'test' = 'run'): Record<string, unknown> {
  const runtime = quickJS.newRuntime()
  runtime.setMemoryLimit(32 * 1024 * 1024)
  const context = runtime.newContext()
  const evaluation = context.evalCode(buildSandboxProgram(request(source, input, mode)))
  if (evaluation.error) {
    const error = context.dump(evaluation.error)
    evaluation.error.dispose()
    context.dispose()
    runtime.dispose()
    throw new Error(JSON.stringify(error))
  }
  const result = context.dump(evaluation.value) as Record<string, unknown>
  evaluation.value.dispose()
  context.dispose()
  runtime.dispose()
  return result
}

describe('QuickJS sandbox program', () => {
  it('executes the student solve function and captures console output', () => {
    const output = evaluate('function solve(input) { console.log("n", input.n); return input.n * 2; }', { n: 4 })
    expect(output.result).toBe(8)
    expect(output.logs).toEqual(['n 4'])
  })

  it('collects generator events only in visualization mode', () => {
    const source = 'function solve() { return true; } function* trace() { yield { type: "visit", row: 0, col: 0 }; }'
    expect(evaluate(source, {}, 'run').events).toHaveLength(1)
    expect(evaluate(source, {}, 'test').events).toHaveLength(0)
  })

  it('does not expose browser capabilities', () => {
    const output = evaluate('function solve() { return [typeof document, typeof fetch, typeof localStorage, typeof XMLHttpRequest]; }', {})
    expect(output.result).toEqual(['undefined', 'undefined', 'undefined', 'undefined'])
  })

  it('runs the result-to-visualization integration pipeline', () => {
    const exercise = exerciseRegistry.get('rook-attack')!
    const input = { size: 8, rookA: { row: 2, col: 1 }, rookB: { row: 2, col: 6 } }
    const output = evaluate('function solve(input) { return input.rookA.row === input.rookB.row || input.rookA.col === input.rookB.col; }', input)
    expect(exercise.validate(input, output.result).valid).toBe(true)
    const events = sanitizeTrace(exercise.resultToEvents(input, output.result), 8)
    const finalState = stateAtStep(events, events.length, exercise.piece)
    expect(finalState.pieces).toHaveLength(2)
    expect(finalState.highlighted).toHaveLength(6)
    expect(finalState.completed).toBe(true)
  })

  it('executes the beginner opening and preserves the complete position', () => {
    const exercise = exerciseRegistry.get('first-opening')!
    const source = 'function solve() { return ["e2-e4", "e7-e5", "g1-f3", "b8-c6"]; }'
    const output = evaluate(source, {})
    expect(exercise.validate({}, output.result).valid).toBe(true)

    const events = sanitizeTrace(exercise.resultToEvents({}, output.result), 8)
    const finalState = stateAtStep(events, events.length, exercise.piece)
    expect(finalState.pieces).toHaveLength(32)
    expect(finalState.pieces).toContainEqual(expect.objectContaining({ row: 5, col: 5, piece: 'knight', color: 'white' }))
    expect(finalState.completed).toBe(true)
  })
})
