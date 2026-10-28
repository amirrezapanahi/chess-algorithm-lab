# User guide — English

## Run locally

```bash
git clone https://github.com/amirrezapanahi/chess-algorithm-lab.git
cd chess-algorithm-lab
npm ci
npm run dev
```

Open the URL printed by Vite. No backend or database server is required.

## Use the laboratory

1. Select an exercise from the header.
2. Read **Problem** and reveal hints progressively.
3. Write a synchronous `solve(input)` function in **Code**.
4. Press **Run** or `Ctrl/Cmd + Enter`.
5. Use the board timeline to inspect each validated trace event.
6. Press **Test** to run the public mathematical validators.
7. Export the solution as `.js` before moving devices.

Your code is autosaved in this browser with IndexedDB. It is not synced to GitHub automatically.

## Minimal solution

```js
function solve(input) {
  return input.value * 2;
}
```

Visualization is optional:

```js
function* trace(input) {
  yield { type: "visit", row: 0, col: 0 };
  yield { type: "complete", message: "Done" };
}
```

See [[Code-Examples]] for complete API examples and [[Exercise-API]] for each input/output contract.

## Interface languages

Use the globe menu to switch between English, Persian, Portuguese, French, Russian, and Arabic. Persian and Arabic switch the interface to RTL while the editor and technical identifiers remain LTR.
