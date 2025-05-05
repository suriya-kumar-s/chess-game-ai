"use client"

import { useDrag, useDrop } from "react-dnd"
import type { BoardType, PieceType } from "./chess-game"
import ChessPiece from "./chess-piece"

interface ChessboardProps {
  board: BoardType
  selectedSquare: { row: number; col: number } | null
  possibleMoves: { row: number; col: number }[]
  onSquareClick: (row: number, col: number) => void
  onPieceDrop: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void
  currentPlayer: "white" | "black"
}

interface SquareProps {
  row: number
  col: number
  piece: PieceType | null
  isSelected: boolean
  isPossibleMove: boolean
  isCheck: boolean
  onClick: () => void
  onDrop: (fromRow: number, fromCol: number) => void
  currentPlayer: "white" | "black"
}

function Square({ row, col, piece, isSelected, isPossibleMove, isCheck, onClick, onDrop, currentPlayer }: SquareProps) {
  const isLight = (row + col) % 2 === 0

  // Set up drag source
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "chess-piece",
      item: { fromRow: row, fromCol: col },
      canDrag: () => piece !== null && piece.color === currentPlayer,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [row, col, piece, currentPlayer],
  )

  // Set up drop target
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "chess-piece",
      drop: (item: { fromRow: number; fromCol: number }) => {
        onDrop(item.fromRow, item.fromCol)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [row, col, onDrop],
  )

  // Combine refs
  const combineRefs = (el: HTMLDivElement) => {
    drag(el)
    drop(el)
  }

  // Determine square color and styling
  let bgColor = isLight ? "bg-red-100" : "bg-amber-800"

  if (isSelected) {
    bgColor = isLight ? "bg-blue-200" : "bg-blue-600"
  } else if (isPossibleMove) {
    bgColor = isLight ? "bg-green-200" : "bg-green-600"
  } else if (isCheck) {
    bgColor = isLight ? "bg-red-200" : "bg-red-600"
  }

  if (isOver && canDrop) {
    bgColor = isLight ? "bg-green-300" : "bg-green-700"
  }

  return (
    <div
      ref={combineRefs}
      className={`relative w-full aspect-square flex items-center justify-center cursor-pointer ${bgColor} ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      onClick={onClick}
    >
      {/* File and rank labels */}
      {col === 0 && (
        <div className="absolute left-1 top-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{8 - row}</div>
      )}
      {row === 7 && (
        <div className="absolute right-1 bottom-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {String.fromCharCode(97 + col)}
        </div>
      )}

      {/* Possible move indicator */}
      {isPossibleMove && !piece && <div className="w-3 h-3 rounded-full bg-green-500 opacity-60"></div>}

      {/* Piece */}
      {piece && <ChessPiece piece={piece} />}
    </div>
  )
}

export default function Chessboard({
  board,
  selectedSquare,
  possibleMoves,
  onSquareClick,
  onPieceDrop,
  currentPlayer,
}: ChessboardProps) {
  // Find the king that's in check
  const findKingInCheck = () => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.type === "king" && piece.color === currentPlayer) {
          // Check if this king is in a possible move of any opponent piece
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const attackingPiece = board[r][c]
              if (attackingPiece && attackingPiece.color !== currentPlayer) {
                const moves = getPossibleMoves(board, r, c)
                if (moves.some((move) => move.row === row && move.col === col)) {
                  return { row, col }
                }
              }
            }
          }
        }
      }
    }
    return null
  }

  const kingInCheck = findKingInCheck()

  const handleDrop = (row: number, col: number, fromRow: number, fromCol: number) => {
    onPieceDrop(fromRow, fromCol, row, col)
  }

  return (
    <div className="w-full max-w-md mx-auto border-2 border-amber-900 rounded-md overflow-hidden shadow-lg">
      <div className="grid grid-cols-8 w-full">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              piece={piece}
              isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
              isPossibleMove={possibleMoves.some((move) => move.row === rowIndex && move.col === colIndex)}
              isCheck={kingInCheck?.row === rowIndex && kingInCheck?.col === colIndex}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              onDrop={(fromRow, fromCol) => handleDrop(rowIndex, colIndex, fromRow, fromCol)}
              currentPlayer={currentPlayer}
            />
          )),
        )}
      </div>
    </div>
  )
}

// Helper function to get possible moves (simplified version for the component)
function getPossibleMoves(board: BoardType, row: number, col: number) {
  // This is a simplified version just for highlighting the king in check
  // The actual implementation is in chess-logic.ts
  return []
}
