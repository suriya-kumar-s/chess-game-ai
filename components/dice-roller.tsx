"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DiceRoller() {
  const [results, setResults] = useState<{ die: string; result: number; timestamp: number }[]>([])

  const rollDie = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1
    const dieType = `d${sides}`

    setResults((prev) => [
      { die: dieType, result, timestamp: Date.now() },
      ...prev.slice(0, 9), // Keep only the last 10 rolls
    ])

    return result
  }

  const rollDice = (count: number, sides: number) => {
    let total = 0
    const rolls: number[] = []

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1
      rolls.push(roll)
      total += roll
    }

    const dieType = `${count}d${sides}`

    setResults((prev) => [
      { die: dieType, result: total, timestamp: Date.now() },
      ...prev.slice(0, 9), // Keep only the last 10 rolls
    ])

    return { total, rolls }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dice Roller</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => rollDie(4)} className="bg-red-700 hover:bg-red-800 h-12">
                d4
              </Button>
              <Button onClick={() => rollDie(6)} className="bg-orange-700 hover:bg-orange-800 h-12">
                d6
              </Button>
              <Button onClick={() => rollDie(8)} className="bg-yellow-700 hover:bg-yellow-800 h-12">
                d8
              </Button>
              <Button onClick={() => rollDie(10)} className="bg-green-700 hover:bg-green-800 h-12">
                d10
              </Button>
              <Button onClick={() => rollDie(12)} className="bg-blue-700 hover:bg-blue-800 h-12">
                d12
              </Button>
              <Button onClick={() => rollDie(20)} className="bg-purple-700 hover:bg-purple-800 h-12">
                d20
              </Button>
              <Button onClick={() => rollDice(4, 6)} className="bg-slate-600 hover:bg-slate-700 h-12">
                4d6
              </Button>
              <Button onClick={() => rollDice(2, 20)} className="bg-slate-600 hover:bg-slate-700 h-12">
                2d20
              </Button>
              <Button onClick={clearResults} className="bg-slate-800 hover:bg-slate-900 h-12">
                Clear
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-2">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => rollDice(3, 6)} className="bg-slate-600 hover:bg-slate-700">
                  3d6 (Ability Check)
                </Button>
                <Button
                  onClick={() => {
                    const { total } = rollDice(1, 20)
                    if (total === 20) {
                      setResults((prev) => [
                        { die: "Critical Hit!", result: total, timestamp: Date.now() - 1 },
                        ...prev.slice(0, 9),
                      ])
                    } else if (total === 1) {
                      setResults((prev) => [
                        { die: "Critical Miss!", result: total, timestamp: Date.now() - 1 },
                        ...prev.slice(0, 9),
                      ])
                    }
                  }}
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  Attack Roll (d20)
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => rollDice(1, 100)} className="bg-slate-600 hover:bg-slate-700">
                  d100 (Percentile)
                </Button>
                <Button
                  onClick={() => {
                    const rolls = []
                    // Roll 4d6 and drop the lowest
                    const { rolls: diceRolls } = rollDice(4, 6)
                    const sortedRolls = [...diceRolls].sort((a, b) => a - b)
                    const total = sortedRolls.slice(1).reduce((sum, roll) => sum + roll, 0)

                    setResults((prev) => [
                      { die: "4d6 (drop lowest)", result: total, timestamp: Date.now() },
                      ...prev.slice(0, 9),
                    ])
                  }}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  4d6 (drop lowest)
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => rollDice(2, 6)} className="bg-orange-700 hover:bg-orange-800">
                  2d6
                </Button>
                <Button onClick={() => rollDice(3, 6)} className="bg-orange-700 hover:bg-orange-800">
                  3d6
                </Button>
                <Button onClick={() => rollDice(5, 6)} className="bg-orange-700 hover:bg-orange-800">
                  5d6
                </Button>
              </div>

              <Button onClick={clearResults} className="w-full bg-slate-800 hover:bg-slate-900">
                Clear Results
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-3 max-h-32 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-1">Results:</h3>
          {results.length === 0 ? (
            <div className="text-sm text-slate-400">No dice rolled yet</div>
          ) : (
            <div className="space-y-1">
              {results.map((roll, index) => (
                <div key={roll.timestamp} className="text-sm flex justify-between">
                  <span>{roll.die}:</span>
                  <span className="font-bold">{roll.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
