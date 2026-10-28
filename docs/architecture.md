# Architecture

## Trusted and untrusted regions

React, the Exercise SDK, validators, persistence, and the SVG renderer run in the trusted page. Student JavaScript is data until it reaches a dedicated Worker. The Worker initializes a fresh QuickJS runtime for each request, evaluates a generated harness and the student source, serializes the result, and disposes the runtime.

The page never receives a live QuickJS object. It accepts only a structured-clone message that passes protocol guards. Trace values then pass an event schema and board-bound checks before state reduction.

## Execution lifecycle

1. The controller creates a new module Worker and sends a bounded request.
2. The Worker loads the single QuickJS release WASM variant.
3. After loading, it signals `started`; only then does the wall-clock execution timer begin.
4. QuickJS receives a 64 MB heap limit, a stack limit, and an interrupt deadline.
5. The harness requires synchronous `solve(input)` and optionally consumes a generator/array from `trace(input)`.
6. Results, console lines, and at most 5,000 trace events are JSON-cloned inside QuickJS.
7. The page validates the response and always terminates the Worker.
8. Cancellation or a hard timeout terminates the Worker immediately.

Tests use a separate execution mode that never evaluates `trace()`, so visualization cost and correctness evaluation limits remain independent.

## Trace playback

The visualizer stores a bounded event list, not arbitrary student state. `stateAtStep` deterministically reduces events from an empty state, which makes previous/next and timeline seeking reliable. With the current 5,000-event limit, replay cost is bounded. If significantly larger traces are introduced, add periodic trusted snapshots rather than raising the limit without measurement.

## Exercises

`ExerciseDefinition` owns metadata, inputs, public cases, starter code, a mathematical validator, and final-result visualization. The registry is the only composition point. Main UI components render the interface generically from the SDK fields.

Reference algorithms are separate test-facing files. They are never copied into the Monaco starter and are not used to fake runtime output.

## Persistence

IndexedDB has two stores: one code string per exercise and one workspace settings record. Autosave is debounced. There is no cross-device sync and no account identity.
