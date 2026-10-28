# Exercise API reference

All coordinates are zero-based `{ row, col }` objects.

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
{ type: "place", row, col, piece?, label? }
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
