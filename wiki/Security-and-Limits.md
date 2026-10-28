# Security and limits

- Student source runs in QuickJS/WebAssembly inside a disposable Web Worker.
- It never runs through page-context `eval`, `new Function`, or script injection.
- DOM, storage, cookies, and network APIs are absent from the guest runtime.
- Default limits: 64 MB QuickJS heap, 2-second visualization run, 1.5-second test, 5,000 trace events, 200 console lines, and 200 KB source.
- Cancellation and hard timeout terminate the entire Worker.
- Results and events are serialized and validated before reaching React or the SVG board.

Workers alone are not a complete security boundary. The design also relies on QuickJS and WebAssembly, and it has not received a formal security audit. Use the lab for normal educational code, not hostile multi-tenant workloads or secrets.

Public tests are visible in the static frontend and are not tamper-proof grading.
