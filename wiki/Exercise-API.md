# Exercise API reference

All coordinates are zero-based `{ row, col }` objects.

## Start Here: First Opening

The board starts with all 32 standard pieces. No input is required.

```ts
input  = {}
output = ["e2-e4", "e7-e5", "g1-f3", "b8-c6"]
```

This small exercise teaches strings, arrays, `return`, Run, Test, and trace playback before algorithms.

## Rook Attack Detection

```ts
input  = { size, rookA: Position, rookB: Position }
output = boolean
```

## N Rooks

```ts
input  = { n, maxSolutions }
output = { placements: Position[][], count: number }
```

Count every valid placement, but retain only the first `maxSolutions` placements.

## N Queens

```ts
input  = { n, maxSolutions }
output = { solutions: Position[][], count: number }
```

Every stored solution must have one queen per row with unique columns and diagonals.

## Knight Shortest Path

```ts
input  = { size, start: Position, target: Position }
output = { path: Position[] }
```

The path includes start and target. Return an empty path only when the target is unreachable.

## Core trace events

```ts
{ type: "setup", pieces: Array<{ row, col, piece, color?, label? }> }
{ type: "place", row, col, piece?, color?, label? }
{ type: "remove", row, col }
{ type: "visit", row, col }
{ type: "check", row, col }
{ type: "conflict", positions }
{ type: "backtrack", row, col }
{ type: "highlight", positions, tone? }
{ type: "solution", positions, piece? }
{ type: "path", positions }
{ type: "complete", message? }
```

`color` is `"white"` or `"black"`. A `setup` event replaces the entire position atomically and rejects duplicate or out-of-board squares.
