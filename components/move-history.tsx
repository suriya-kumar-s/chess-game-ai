import type { MoveType } from "./chess-game"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MoveHistoryProps {
  moves: MoveType[]
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  // Group moves by pairs (white and black)
  const groupedMoves = []
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: i + 1 < moves.length ? moves[i + 1] : undefined,
    })
  }

  return (
    <div>
      <h3 className="font-medium mb-2">Move History</h3>

      {moves.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No moves yet</p>
      ) : (
        <ScrollArea className="h-[300px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-1 text-left font-medium">#</th>
                <th className="py-2 px-1 text-left font-medium">Red</th>
                <th className="py-2 px-1 text-left font-medium">Black</th>
              </tr>
            </thead>
            <tbody>
              {groupedMoves.map((group) => (
                <tr key={group.number} className="border-b border-slate-200 dark:border-slate-700">
                  <td className="py-2 px-1 text-slate-500">{group.number}.</td>
                  <td className="py-2 px-1">
                    <span className="font-mono">{group.white.notation}</span>
                  </td>
                  <td className="py-2 px-1">
                    {group.black && <span className="font-mono">{group.black.notation}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )}
    </div>
  )
}
