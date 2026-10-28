interface RookAttackInput {
  rookA: { row: number; col: number }
  rookB: { row: number; col: number }
}

export function solveRookAttack({ rookA, rookB }: RookAttackInput): boolean {
  return rookA.row === rookB.row || rookA.col === rookB.col
}
