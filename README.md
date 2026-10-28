# Chess Algorithm Lab

Chess Algorithm Lab is a browser-based environment for learning algorithms through chessboard problems. Students write ordinary JavaScript in Monaco, run it inside an isolated QuickJS/WebAssembly runtime, inspect the result, play a validated event trace forward or backward, and run exercise-specific correctness tests.

There is no backend, account system, database server, or paid service. The built application is static and deploys to GitHub Pages.

## What is included

- A responsive IDE layout with resizable editor, visualizer, and console panels
- Monaco JavaScript editing with `Ctrl/Cmd + Enter` execution
- QuickJS/WASM execution in a dedicated Web Worker
- Wall-clock, memory, source-size, and trace-event limits
- Cancellation by terminating and recreating the worker
- An SVG chessboard for arbitrary boards from 1×1 to 20×20
- Forward/backward trace playback, speed controls, and skip-to-end
- Four complete exercises with mathematical validators:
  - Rook Attack Detection
  - N Rooks
  - N Queens
  - Knight Shortest Path
- Local autosave in IndexedDB, plus `.js` import and export
- English, Persian, Portuguese, French, Russian, and Arabic UI
- Correct LTR/RTL switching for Persian and Arabic while code remains LTR
- Installable app-style experience through a web app manifest
- Light and dark themes
- Unit and integration tests, strict TypeScript, ESLint, and GitHub Pages CI

## Quick start

Requirements: Node.js 20.19 or newer and npm.

```bash
git clone https://github.com/YOUR-ACCOUNT/chess-algorithm-lab.git
cd chess-algorithm-lab
npm ci
npm run dev
```

Open the local URL printed by Vite. Changes to application code reload automatically; code written inside the lab runs instantly and needs no manual build step.

Useful commands:

```bash
npm run lint        # ESLint
npm run typecheck   # strict TypeScript
npm test            # Vitest suite
npm run build       # production GitHub Pages build
npm run preview     # serve the production build locally
```

## Student workflow

1. Fork this repository and clone your fork.
2. Choose an exercise in the lab.
3. Read the problem and reveal hints as needed.
4. Implement `solve(input)` in the web editor.
5. Optionally implement `trace(input)` as a generator for step-by-step visualization.
6. Use **Test** for public correctness checks.
7. Export the solution and save it under `student-solutions/` in your fork.
8. Run the repository checks, commit, push, and open a pull request or submit through GitHub Classroom.

The web editor never claims to commit or push your work. IndexedDB data stays in the current browser profile and can be cleared by the browser; export important work to a file.

## Multilingual GitHub Wiki

Reviewable Wiki source is stored under [`wiki/`](wiki/). It includes six language guides, runnable JavaScript examples, every exercise contract, sandbox limits, local setup, and publishing instructions.

After enabling the repository Wiki and creating its first page once, run **Actions → Publish GitHub Wiki**. The manual workflow synchronizes these pages to the real GitHub Wiki repository.

## Student API

Every exercise supports two independent interfaces:

```js
function solve(input) {
  // Return the computed result. Tests only depend on this function.
}

function* trace(input) {
  // Optional. Yield visualization events.
  yield { type: "visit", row: 1, col: 2 };
  yield { type: "complete", message: "Done" };
}
```

Supported core events include `place`, `remove`, `visit`, `check`, `conflict`, `backtrack`, `highlight`, `solution`, `path`, and `complete`. Events are schema-validated and bounded before reaching the board. A valid `solve()` never needs a `trace()`; when trace data is absent, an exercise may visualize only the final result.

## Architecture

```text
Monaco editor
    ↓ validated request
execution controller
    ↓ dedicated module Worker
QuickJS WebAssembly runtime
    ↓ serialized result + trace
schema validation
    ↓
exercise validator + SVG visualizer
```

The main implementation lives under `src/`:

- `src/execution/` — worker protocol, QuickJS harness, limits, and cancellation controller
- `src/exercises/` — independent exercise modules and reference implementations used by tests
- `src/lib/` — trace state, validators, IndexedDB persistence, and console types
- `src/components/` — accessible editor, board, playback, input, and console views
- `src/types/lab.ts` — the Exercise SDK and typed trace schema

See [Architecture](docs/architecture.md), [Creating an exercise](docs/creating-an-exercise.md), and [Security model](docs/security.md) for details.

## Deploy a fork to GitHub Pages

1. Push the fork to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. Push to `main` or run the **Verify and deploy to GitHub Pages** workflow manually.

The workflow derives Vite's base path from `GITHUB_REPOSITORY`, so repository project pages such as `https://name.github.io/chess-algorithm-lab/` work without editing source. User/organization repositories ending in `.github.io` use `/`. Worker and WASM assets are emitted as base-aware static assets.

To point the header repository button at your fork, create `.env.local`:

```text
VITE_REPOSITORY_URL=https://github.com/YOUR-ACCOUNT/chess-algorithm-lab
```

More detail is in [Publishing](docs/publishing.md).

## Security and evaluation limits

Student code is not run with `eval`, `new Function`, or injected scripts in the application page. QuickJS supplies a separate JavaScript global environment with no DOM, cookies, browser storage, or network APIs, and it runs in a disposable Worker. The controller terminates workers that exceed their time budget.

This is defense in depth, not a claim of perfect security. QuickJS/WebAssembly and browsers can contain defects, Workers alone are not a security boundary, and this project has not undergone a formal security audit. Public frontend tests are visible and can be changed in a fork; they are educational feedback, not tamper-proof grading. Read [Security model](docs/security.md) before using the lab with adversarial code.

## Contributing

Bug reports, exercise ideas, translations, and accessibility improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Licensed under the terms in [LICENSE](LICENSE).
