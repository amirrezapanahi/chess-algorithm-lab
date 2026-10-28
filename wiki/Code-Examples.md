# Code examples

Student algorithms are currently standard synchronous JavaScript. TypeScript support may be added later.

## First lesson: a four-move opening

This is the complete answer for **01 · Start Here**:

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

The array preserves order. Each quoted item is a string containing a source square, a hyphen, and a destination square. The exercise supplies the full 32-piece visualization, so beginners do not need to write `trace()` yet.

## `solve(input)`

`solve` is required and is the only function used for correctness tests.

```js
function solve(input) {
  const { rookA, rookB } = input;
  return rookA.row === rookB.row || rookA.col === rookB.col;
}
```

## `trace(input)` generator

`trace` is optional and cannot affect whether the answer is correct.

```js
function* trace(input) {
  yield { type: "place", ...input.rookA, piece: "rook", label: "A" };
  yield { type: "place", ...input.rookB, piece: "rook", label: "B" };

  if (input.rookA.row === input.rookB.row) {
    const from = Math.min(input.rookA.col, input.rookB.col);
    const to = Math.max(input.rookA.col, input.rookB.col);
    const positions = [];
    for (let col = from; col <= to; col += 1) {
      positions.push({ row: input.rookA.row, col });
    }
    yield { type: "highlight", positions, tone: "attack" };
  }

  yield { type: "complete", message: "Done" };
}
```

## Backtracking events

```js
function* exampleBacktrack(row, col) {
  yield { type: "check", row, col };
  yield { type: "place", row, col, piece: "queen" };
  yield { type: "conflict", positions: [{ row, col }, { row: 0, col: 0 }] };
  yield { type: "backtrack", row, col };
}
```

## Knight path events

```js
function* showPath(path, visited) {
  for (const square of visited) {
    yield { type: "visit", ...square };
  }
  yield { type: "path", positions: path };
  yield { type: "complete", message: `${path.length - 1} moves` };
}
```

## Console output

`console.log`, `console.info`, `console.warn`, and `console.error` are captured safely. At most 200 lines are retained.

```js
function solve(input) {
  console.log("Input", input);
  return true;
}
```

The sandbox does not expose `document`, `window`, `fetch`, cookies, local storage, or application objects.
