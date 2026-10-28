# Security model

## Protections

- Student source never uses page-context `eval`, `new Function`, script tags, or generated HTML.
- QuickJS runs inside a dedicated disposable Web Worker.
- The QuickJS global environment does not contain `document`, `window`, cookies, browser storage, `fetch`, `XMLHttpRequest`, or application objects.
- No host function with storage, network, filesystem, or DOM authority is exposed.
- Each run gets a fresh runtime with memory, stack, interrupt, source-size, and event-count limits.
- The main thread applies a second wall-clock timer and terminates a stuck Worker.
- Messages are type-checked; trace events are schema-checked and board-bounded.
- UI rendering uses React text and trusted SVG state. Student HTML is never rendered.

## Remaining limitations

A Worker alone is not full isolation. The design relies on the browser, WebAssembly engine, and QuickJS bindings. Any of those may have vulnerabilities, and this project has not received a formal security audit. Resource measurements differ across devices; limits reduce denial-of-service risk but cannot eliminate it. Very large JSON results may consume memory before they cross the message boundary, though the QuickJS heap limit bounds the guest side.

This lab is suitable for normal educational code. Do not use it as the sole boundary for actively hostile multi-tenant workloads or secrets.

## Public tests

Frontend tests and validators are shipped to every browser. A student can inspect or modify them in a fork. They provide immediate learning feedback, not secret or tamper-proof grading. Instructors needing protected grading should run independent server-side or CI tests outside this static application.

## Dependency updates

Run `npm audit`, the full test suite, and a production build when updating Monaco, QuickJS, Vite, or Worker-related dependencies. Confirm that the built output contains the expected Worker and a single QuickJS WASM asset.
