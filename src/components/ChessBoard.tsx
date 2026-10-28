import type { KeyboardEvent } from 'react'
import type { Language, PieceKind, Position } from '../types/lab'
import type { VisualState } from '../lib/trace'
import { translate } from '../i18n'

const glyphs: Record<PieceKind, string> = {
  rook: '♜',
  queen: '♛',
  bishop: '♝',
  knight: '♞',
  king: '♚',
  pawn: '♟',
}

const keyOf = ({ row, col }: Position): string => `${row}:${col}`

interface ChessBoardProps {
  size: number
  state: VisualState
  language: Language
  selected?: Position
  onSelect?: (position: Position) => void
}

export function ChessBoard({ size, state, language, selected, onSelect }: ChessBoardProps) {
  const safeSize = Math.max(1, Math.min(20, Math.floor(size)))
  const cell = 100 / safeSize
  const pieces = new Map(state.pieces.map((piece) => [keyOf(piece), piece]))
  const visited = new Set(state.visited.map(keyOf))
  const checked = new Set(state.checked.map(keyOf))
  const conflicts = new Set(state.conflicts.map(keyOf))
  const highlighted = new Set(state.highlighted.map(keyOf))
  const path = new Set(state.path.map(keyOf))
  const selectedKey = selected ? keyOf(selected) : ''

  const activate = (position: Position) => onSelect?.(position)
  const onKeyDown = (event: KeyboardEvent<SVGGElement>, position: Position): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate(position)
    }
  }

  return (
    <div className="board-frame" dir="ltr">
      <svg
        className="chessboard"
        viewBox="-4 -4 108 108"
        role="grid"
        aria-label={`${translate(language, 'board')} ${safeSize} × ${safeSize}`}
      >
        <defs>
          <filter id="piece-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.2" stdDeviation=".8" floodOpacity=".28" />
          </filter>
        </defs>
        <rect x="-1.4" y="-1.4" width="102.8" height="102.8" rx="2.4" className="board-border" />
        {Array.from({ length: safeSize * safeSize }, (_, index) => {
          const row = Math.floor(index / safeSize)
          const col = index % safeSize
          const position = { row, col }
          const squareKey = keyOf(position)
          const piece = pieces.get(squareKey)
          const isLight = (row + col) % 2 === 0
          let overlay = ''
          if (visited.has(squareKey)) overlay = 'square-visited'
          if (highlighted.has(squareKey)) overlay = 'square-highlighted'
          if (path.has(squareKey)) overlay = 'square-path'
          if (checked.has(squareKey)) overlay = 'square-checked'
          if (conflicts.has(squareKey)) overlay = 'square-conflict'
          if (selectedKey === squareKey) overlay = 'square-selected'
          const label = `${translate(language, 'row')} ${row}, ${translate(language, 'column')} ${col}${piece ? `, ${piece.piece}` : ''}`
          return (
            <g
              key={squareKey}
              role="gridcell"
              tabIndex={onSelect ? 0 : -1}
              aria-label={label}
              onClick={() => activate(position)}
              onKeyDown={(event) => onKeyDown(event, position)}
              className={onSelect ? 'board-square interactive' : 'board-square'}
            >
              <rect
                x={col * cell}
                y={row * cell}
                width={cell}
                height={cell}
                className={isLight ? 'square-light' : 'square-dark'}
              />
              {overlay && (
                <rect
                  x={col * cell + cell * 0.07}
                  y={row * cell + cell * 0.07}
                  width={cell * 0.86}
                  height={cell * 0.86}
                  rx={cell * 0.12}
                  className={overlay}
                />
              )}
              {piece && (
                <>
                  <text
                    x={(col + 0.5) * cell}
                    y={(row + 0.54) * cell}
                    className="piece-glyph"
                    style={{ fontSize: `${cell * 0.78}px` }}
                    filter="url(#piece-shadow)"
                  >
                    {glyphs[piece.piece]}
                  </text>
                  {piece.label && safeSize <= 10 && (
                    <text x={(col + 0.78) * cell} y={(row + 0.26) * cell} className="piece-label" style={{ fontSize: `${cell * 0.18}px` }}>
                      {piece.label}
                    </text>
                  )}
                </>
              )}
            </g>
          )
        })}
        {state.path.length > 1 && (
          <polyline
            points={state.path.map(({ row, col }) => `${(col + 0.5) * cell},${(row + 0.5) * cell}`).join(' ')}
            className="path-line"
          />
        )}
        {safeSize <= 10 && Array.from({ length: safeSize }, (_, index) => (
          <g key={`coordinates-${index}`} className="board-coordinate">
            <text x={(index + 0.5) * cell} y="103.2" textAnchor="middle">{index < 26 ? String.fromCharCode(97 + index) : index}</text>
            <text x="-2.2" y={(safeSize - index - 0.5) * cell + 0.7} textAnchor="middle">{index + 1}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
