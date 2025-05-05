import ChessGame from "@/components/chess-game"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <ChessGame />
    </main>
  )
}
