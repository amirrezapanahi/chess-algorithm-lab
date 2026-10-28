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

## Start from zero: your first opening

Select **01 · Start Here**. The board already contains all 32 pieces: Black occupies ranks 8 and 7, White occupies ranks 1 and 2. Files run from `a` to `h`; ranks run from `1` to `8`.

You only need four JavaScript ideas:

- `function solve()` creates the function the lab will call.
- Text inside quotes, such as `"e2-e4"`, is a **string**.
- Square brackets create an ordered **array**.
- `return` sends the answer back to the lab.

```js
function solve() {
  return [
    "e2-e4",
    "e7-e5",
    "g1-f3",
    "b8-c6",
  ];
}
```

White moves the king pawn, Black replies symmetrically, then both sides develop a knight. Press **Run**, open **Board**, and use the timeline. Press **Test**; the expected result is `1/1` passed.

Common mistakes are missing quotes or commas, using an en dash instead of `-`, changing the move order, or writing `E2-E4` with uppercase letters. This lesson needs no `input` and no custom `trace()`; the visualizer handles the board for you.
