import type { PieceType } from "./chess-game"

interface ChessPieceProps {
  piece: PieceType
}

export default function ChessPiece({ piece }: ChessPieceProps) {
  const getPieceSymbol = () => {
    const { type, color } = piece

    switch (type) {
      case "pawn":
        return color === "white" ? "♙" : "♟"
      case "rook":
        return color === "white" ? "♖" : "♜"
      case "knight":
        return color === "white" ? "♘" : "♞"
      case "bishop":
        return color === "white" ? "♗" : "♝"
      case "queen":
        return color === "white" ? "♕" : "♛"
      case "king":
        return color === "white" ? "♔" : "♚"
      default:
        return ""
    }
  }

  return (
    <div className={`text-3xl md:text-4xl ${piece.color === "white" ? "text-red-500" : "text-black"}`}>
      {getPieceSymbol()}
    </div>
  )
}
