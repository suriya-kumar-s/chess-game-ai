import type { BoardType } from "@/components/chess-game"

export function initialBoard(): BoardType {
  const board: BoardType = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black" }
    board[6][col] = { type: "pawn", color: "white" }
  }

  // Set up rooks
  board[0][0] = { type: "rook", color: "black" }
  board[0][7] = { type: "rook", color: "black" }
  board[7][0] = { type: "rook", color: "white" }
  board[7][7] = { type: "rook", color: "white" }

  // Set up knights
  board[0][1] = { type: "knight", color: "black" }
  board[0][6] = { type: "knight", color: "black" }
  board[7][1] = { type: "knight", color: "white" }
  board[7][6] = { type: "knight", color: "white" }

  // Set up bishops
  board[0][2] = { type: "bishop", color: "black" }
  board[0][5] = { type: "bishop", color: "black" }
  board[7][2] = { type: "bishop", color: "white" }
  board[7][5] = { type: "bishop", color: "white" }

  // Set up queens
  board[0][3] = { type: "queen", color: "black" }
  board[7][3] = { type: "queen", color: "white" }

  // Set up kings
  board[0][4] = { type: "king", color: "black" }
  board[7][4] = { type: "king", color: "white" }

  return board
}

export function getPossibleMoves(board: BoardType, row: number, col: number): { row: number; col: number }[] {
  const piece = board[row][col]
  if (!piece) return []

  const moves: { row: number; col: number }[] = []
  const { type, color } = piece

  // Helper to check if a square is empty or has an opponent's piece
  const canMoveTo = (r: number, c: number) => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false
    const targetPiece = board[r][c]
    return !targetPiece || targetPiece.color !== color
  }

  // Helper to check if a square has an opponent's piece
  const hasOpponent = (r: number, c: number) => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false
    const targetPiece = board[r][c]
    return targetPiece && targetPiece.color !== color
  }

  // Helper to check if a square is empty
  const isEmpty = (r: number, c: number) => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false
    return board[r][c] === null
  }

  switch (type) {
    case "pawn": {
      const direction = color === "white" ? -1 : 1
      const startRow = color === "white" ? 6 : 1

      // Move forward one square
      if (isEmpty(row + direction, col)) {
        moves.push({ row: row + direction, col })

        // Move forward two squares from starting position
        if (row === startRow && isEmpty(row + 2 * direction, col)) {
          moves.push({ row: row + 2 * direction, col })
        }
      }

      // Capture diagonally
      if (hasOpponent(row + direction, col - 1)) {
        moves.push({ row: row + direction, col: col - 1 })
      }
      if (hasOpponent(row + direction, col + 1)) {
        moves.push({ row: row + direction, col: col + 1 })
      }

      // TODO: En passant and promotion
      break
    }

    case "rook": {
      // Check horizontal and vertical lines
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]

      for (const [dr, dc] of directions) {
        let r = row + dr
        let c = col + dc

        while (canMoveTo(r, c)) {
          moves.push({ row: r, col: c })

          // If we hit an opponent's piece, we can't go further
          if (hasOpponent(r, c)) break

          r += dr
          c += dc
        }
      }
      break
    }

    case "knight": {
      // Knight moves in L-shape
      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ]

      for (const [dr, dc] of knightMoves) {
        const r = row + dr
        const c = col + dc

        if (canMoveTo(r, c)) {
          moves.push({ row: r, col: c })
        }
      }
      break
    }

    case "bishop": {
      // Check diagonal lines
      const directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]

      for (const [dr, dc] of directions) {
        let r = row + dr
        let c = col + dc

        while (canMoveTo(r, c)) {
          moves.push({ row: r, col: c })

          // If we hit an opponent's piece, we can't go further
          if (hasOpponent(r, c)) break

          r += dr
          c += dc
        }
      }
      break
    }

    case "queen": {
      // Queen combines rook and bishop movements
      // Check horizontal and vertical lines
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]

      for (const [dr, dc] of directions) {
        let r = row + dr
        let c = col + dc

        while (canMoveTo(r, c)) {
          moves.push({ row: r, col: c })

          // If we hit an opponent's piece, we can't go further
          if (hasOpponent(r, c)) break

          r += dr
          c += dc
        }
      }
      break
    }

    case "king": {
      // King moves one square in any direction
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ]

      for (const [dr, dc] of directions) {
        const r = row + dr
        const c = col + dc

        if (canMoveTo(r, c)) {
          moves.push({ row: r, col: c })
        }
      }

      // TODO: Castling
      break
    }
  }

  return moves
}

export function movePiece(board: BoardType, fromRow: number, fromCol: number, toRow: number, toCol: number): BoardType {
  const newBoard = board.map((row) => [...row])
  const piece = newBoard[fromRow][fromCol]

  // Move the piece
  newBoard[toRow][toCol] = piece
  newBoard[fromRow][fromCol] = null

  // Handle pawn promotion
  if (piece?.type === "pawn" && (toRow === 0 || toRow === 7)) {
    newBoard[toRow][toCol] = { type: "queen", color: piece.color }
  }

  return newBoard
}

export function isCheck(board: BoardType, playerColor: "white" | "black"): boolean {
  // Find the king
  let kingRow = -1
  let kingCol = -1

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === "king" && piece.color === playerColor) {
        kingRow = row
        kingCol = col
        break
      }
    }
    if (kingRow !== -1) break
  }

  // Check if any opponent piece can capture the king
  const opponentColor = playerColor === "white" ? "black" : "white"

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === opponentColor) {
        const moves = getPossibleMoves(board, row, col)
        if (moves.some((move) => move.row === kingRow && move.col === kingCol)) {
          return true
        }
      }
    }
  }

  return false
}

export function isCheckmate(board: BoardType, playerColor: "white" | "black"): boolean {
  // If not in check, it's not checkmate
  if (!isCheck(board, playerColor)) return false

  // Try all possible moves for all pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === playerColor) {
        const moves = getPossibleMoves(board, row, col)

        // Try each move to see if it gets out of check
        for (const move of moves) {
          const newBoard = movePiece(board, row, col, move.row, move.col)
          if (!isCheck(newBoard, playerColor)) {
            return false // Found a move that gets out of check
          }
        }
      }
    }
  }

  // No moves get out of check
  return true
}
