"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Undo2, RotateCcw, Trophy, Info } from "lucide-react"
import Chessboard from "@/components/chessboard"
import MoveHistory from "@/components/move-history"
import CapturedPieces from "@/components/captured-pieces"
import { initialBoard, getPossibleMoves, movePiece, isCheck, isCheckmate } from "@/lib/chess-logic"
import { useMobile } from "@/hooks/use-mobile"

export type PieceType = {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
  color: "white" | "black"
}

export type BoardType = (PieceType | null)[][]

export type MoveType = {
  from: { row: number; col: number }
  to: { row: number; col: number }
  piece: PieceType
  captured?: PieceType
  notation: string
}

export default function ChessGame() {
  const [board, setBoard] = useState<BoardType>(initialBoard())
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<{ row: number; col: number }[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [moveHistory, setMoveHistory] = useState<MoveType[]>([])
  const [capturedPieces, setCapturedPieces] = useState<{ white: PieceType[]; black: PieceType[] }>({
    white: [],
    black: [],
  })
  const [gameStatus, setGameStatus] = useState<"playing" | "check" | "checkmate" | "stalemate">("playing")
  const isMobile = useMobile()
  const Backend = isMobile ? TouchBackend : HTML5Backend

  useEffect(() => {
    // Check for check or checkmate after each move
    if (moveHistory.length > 0) {
      if (isCheck(board, currentPlayer)) {
        if (isCheckmate(board, currentPlayer)) {
          setGameStatus("checkmate")
        } else {
          setGameStatus("check")
        }
      } else {
        setGameStatus("playing")
      }
    }
  }, [board, currentPlayer, moveHistory])

  const handleSquareClick = (row: number, col: number) => {
    // If a piece is already selected
    if (selectedSquare) {
      // Check if the clicked square is a valid move
      const isValidMove = possibleMoves.some((move) => move.row === row && move.col === col)

      if (isValidMove) {
        // Move the piece
        const piece = board[selectedSquare.row][selectedSquare.col]
        const capturedPiece = board[row][col]

        // Generate algebraic notation
        const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
        const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

        let notation = ""
        if (piece?.type === "king" && Math.abs(selectedSquare.col - col) === 2) {
          // Castling
          notation = col > selectedSquare.col ? "O-O" : "O-O-O"
        } else {
          if (piece?.type !== "pawn") {
            notation += piece?.type.charAt(0).toUpperCase()
          }

          // Add capture symbol
          if (capturedPiece) {
            if (piece?.type === "pawn") {
              notation += files[selectedSquare.col]
            }
            notation += "x"
          }

          notation += files[col] + ranks[row]
        }

        const newBoard = movePiece(board, selectedSquare.row, selectedSquare.col, row, col)
        setBoard(newBoard)

        // Record the move
        const move: MoveType = {
          from: { row: selectedSquare.row, col: selectedSquare.col },
          to: { row, col },
          piece: piece!,
          notation: notation,
        }

        if (capturedPiece) {
          move.captured = capturedPiece
          setCapturedPieces((prev) => {
            const newCaptured = { ...prev }
            newCaptured[currentPlayer].push(capturedPiece)
            return newCaptured
          })
        }

        setMoveHistory([...moveHistory, move])

        // Switch player
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white")

        // Reset selection
        setSelectedSquare(null)
        setPossibleMoves([])
      } else {
        // If clicked on another piece of the same color, select that piece instead
        const clickedPiece = board[row][col]
        if (clickedPiece && clickedPiece.color === currentPlayer) {
          setSelectedSquare({ row, col })
          setPossibleMoves(getPossibleMoves(board, row, col))
        } else {
          // If clicked on an invalid square, deselect
          setSelectedSquare(null)
          setPossibleMoves([])
        }
      }
    } else {
      // If no piece is selected yet, select the piece if it belongs to the current player
      const piece = board[row][col]
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col })
        setPossibleMoves(getPossibleMoves(board, row, col))
      }
    }
  }

  const handleDrop = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = board[fromRow][fromCol]

    // Check if the move is valid
    const validMoves = getPossibleMoves(board, fromRow, fromCol)
    const isValidMove = validMoves.some((move) => move.row === toRow && move.col === toCol)

    if (piece && piece.color === currentPlayer && isValidMove) {
      const capturedPiece = board[toRow][toCol]

      // Generate algebraic notation
      const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
      const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

      let notation = ""
      if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
        // Castling
        notation = toCol > fromCol ? "O-O" : "O-O-O"
      } else {
        if (piece.type !== "pawn") {
          notation += piece.type.charAt(0).toUpperCase()
        }

        // Add capture symbol
        if (capturedPiece) {
          if (piece.type === "pawn") {
            notation += files[fromCol]
          }
          notation += "x"
        }

        notation += files[toCol] + ranks[toRow]
      }

      const newBoard = movePiece(board, fromRow, fromCol, toRow, toCol)
      setBoard(newBoard)

      // Record the move
      const move: MoveType = {
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        piece: piece,
        notation: notation,
      }

      if (capturedPiece) {
        move.captured = capturedPiece
        setCapturedPieces((prev) => {
          const newCaptured = { ...prev }
          newCaptured[currentPlayer].push(capturedPiece)
          return newCaptured
        })
      }

      setMoveHistory([...moveHistory, move])

      // Switch player
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white")

      // Reset selection
      setSelectedSquare(null)
      setPossibleMoves([])
    }
  }

  const handleUndoMove = () => {
    if (moveHistory.length === 0) return

    const lastMove = moveHistory[moveHistory.length - 1]
    const newBoard = [...board.map((row) => [...row])]

    // Move the piece back
    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece

    // If a piece was captured, put it back
    if (lastMove.captured) {
      newBoard[lastMove.to.row][lastMove.to.col] = lastMove.captured

      // Remove from captured pieces
      setCapturedPieces((prev) => {
        const newCaptured = { ...prev }
        const index = newCaptured[currentPlayer === "white" ? "black" : "white"].findIndex(
          (p) => p.type === lastMove.captured?.type && p.color === lastMove.captured?.color,
        )
        if (index !== -1) {
          newCaptured[currentPlayer === "white" ? "black" : "white"].splice(index, 1)
        }
        return newCaptured
      })
    } else {
      newBoard[lastMove.to.row][lastMove.to.col] = null
    }

    setBoard(newBoard)
    setMoveHistory(moveHistory.slice(0, -1))
    setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
    setGameStatus("playing")
  }

  const handleResetGame = () => {
    setBoard(initialBoard())
    setSelectedSquare(null)
    setPossibleMoves([])
    setCurrentPlayer("white")
    setMoveHistory([])
    setCapturedPieces({ white: [], black: [] })
    setGameStatus("playing")
  }

  return (
    <DndProvider backend={Backend}>
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800 dark:text-white">Chess Game</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${currentPlayer === "black" ? "bg-black" : "bg-red-500 border border-gray-400"} mr-2`}
                    ></div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {currentPlayer === "white" ? "White" : "Black"}'s turn
                    </span>
                  </div>

                  {gameStatus !== "playing" && (
                    <Badge variant={gameStatus === "check" ? "warning" : "destructive"} className="ml-2">
                      {gameStatus === "check" ? "Check!" : "Checkmate!"}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-center">
                  <Chessboard
                    board={board}
                    selectedSquare={selectedSquare}
                    possibleMoves={possibleMoves}
                    onSquareClick={handleSquareClick}
                    onPieceDrop={handleDrop}
                    currentPlayer={currentPlayer}
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm" onClick={handleUndoMove} disabled={moveHistory.length === 0}>
                    <Undo2 className="mr-1 h-4 w-4" /> Undo
                  </Button>

                  <Button variant="outline" size="sm" onClick={handleResetGame}>
                    <RotateCcw className="mr-1 h-4 w-4" /> Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Tabs defaultValue="moves" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="moves">Moves</TabsTrigger>
                <TabsTrigger value="info">Game Info</TabsTrigger>
              </TabsList>

              <TabsContent value="moves">
                <Card>
                  <CardContent className="p-4">
                    <MoveHistory moves={moveHistory} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info">
                <Card>
                  <CardContent className="space-y-4 p-4">
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Trophy className="h-4 w-4 mr-1 text-amber-500" /> Game Status
                      </h3>
                      <div className="text-sm">
                        {gameStatus === "playing" && "Game in progress"}
                        {gameStatus === "check" && `${currentPlayer} is in check!`}
                        {gameStatus === "checkmate" &&
                          `Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins!`}
                        {gameStatus === "stalemate" && "Stalemate! The game is a draw."}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-1 text-blue-500" /> Captured Pieces
                      </h3>
                      <CapturedPieces capturedPieces={capturedPieces} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
