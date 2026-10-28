# Contributing

Thank you for improving Chess Algorithm Lab. Keep changes focused on algorithm education, browser execution, accessibility, or the exercise authoring experience. The project intentionally has no backend, authentication, chess engine, or multiplayer layer.

## Development

```bash
npm ci
npm run dev
```

Before submitting a pull request, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The production build matters: it verifies Worker and WebAssembly asset emission as well as the GitHub Pages base path.

## Pull requests

- Explain the user-facing behavior and why the change is needed.
- Add or update tests for validators, runtime protocol changes, and trace state changes.
- Keep interface text in all six localization resources: `en`, `fa`, `pt`, `fr`, `ru`, and `ar`.
- Preserve keyboard operation and visible focus styles.
- Do not execute student source in the trusted page context.
- Do not add a dependency when a small, maintainable local implementation is enough.
- Do not bundle complete solutions into student starter code. Reference implementations belong in `reference.ts` files and test-only imports.

For a new problem, follow [docs/creating-an-exercise.md](docs/creating-an-exercise.md).

## Reporting security issues

Do not post a working sandbox escape as a public issue. Follow [SECURITY.md](SECURITY.md).
