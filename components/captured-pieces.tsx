import type { PieceType } from "./chess-game"
import ChessPiece from "./chess-piece"

interface CapturedPiecesProps {
  capturedPieces: {
    white: PieceType[]
    black: PieceType[]
  }
}

export default function CapturedPieces({ capturedPieces }: CapturedPiecesProps) {
  // Sort pieces by value
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0, // Kings shouldn't be captured, but just in case
  }

  const sortedWhite = [...capturedPieces.white].sort((a, b) => pieceValues[b.type] - pieceValues[a.type])

  const sortedBlack = [...capturedPieces.black].sort((a, b) => pieceValues[b.type] - pieceValues[a.type])

  // Calculate material advantage
  const whiteMaterial = capturedPieces.white.reduce((sum, piece) => sum + pieceValues[piece.type], 0)
  const blackMaterial = capturedPieces.black.reduce((sum, piece) => sum + pieceValues[piece.type], 0)
  const advantage = blackMaterial - whiteMaterial

  return (
    <div className="space-y-3">
      {advantage !== 0 && (
        <div className="text-sm font-medium">
          Material advantage: {advantage > 0 ? "Red +" : "Black +"}
          {Math.abs(advantage)}
        </div>
      )}

      <div>
        <div className="text-sm mb-1">Captured by Red:</div>
        <div className="flex flex-wrap gap-1 min-h-8 p-2 bg-slate-100 dark:bg-slate-700 rounded">
          {sortedBlack.length > 0 ? (
            sortedBlack.map((piece, index) => (
              <div key={index} className="text-lg">
                <ChessPiece piece={piece} />
              </div>
            ))
          ) : (
            <span className="text-sm text-slate-400">None</span>
          )}
        </div>
      </div>

      <div>
        <div className="text-sm mb-1">Captured by Black:</div>
        <div className="flex flex-wrap gap-1 min-h-8 p-2 bg-slate-100 dark:bg-slate-700 rounded">
          {sortedWhite.length > 0 ? (
            sortedWhite.map((piece, index) => (
              <div key={index} className="text-lg">
                <ChessPiece piece={piece} />
              </div>
            ))
          ) : (
            <span className="text-sm text-slate-400">None</span>
          )}
        </div>
      </div>
    </div>
  )
}
