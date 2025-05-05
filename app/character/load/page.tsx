"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoadCharacterPage() {
  const router = useRouter()

  // Sample saved characters - in a real app, this would come from storage or an API
  const [savedCharacters] = useState([
    {
      id: "char1",
      name: "Thorin Oakenshield",
      race: "Dwarf",
      class: "Fighter",
      level: 1,
      lastPlayed: "2 days ago",
    },
    {
      id: "char2",
      name: "Elindra Moonwhisper",
      race: "Elf",
      class: "Wizard",
      level: 2,
      lastPlayed: "1 week ago",
    },
    {
      id: "char3",
      name: "Grimble Stoutfoot",
      race: "Halfling",
      class: "Rogue",
      level: 1,
      lastPlayed: "3 weeks ago",
    },
  ])

  const handleLoadCharacter = (characterId: string) => {
    // In a real app, we would load the character data here
    console.log("Loading character:", characterId)
    router.push("/game")
  }

  const handleDeleteCharacter = (characterId: string) => {
    // In a real app, we would delete the character here
    console.log("Deleting character:", characterId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back to Home
          </Button>
        </Link>

        <h1 className="mb-6 text-3xl font-bold">Load Character</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedCharacters.map((character) => (
            <Card key={character.id} className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle>{character.name}</CardTitle>
                <CardDescription className="text-slate-300">
                  Level {character.level} {character.race} {character.class}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-400">Last played: {character.lastPlayed}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteCharacter(character.id)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-950"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handleLoadCharacter(character.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Load Character
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {savedCharacters.length === 0 && (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-2">No Saved Characters</h2>
            <p className="text-slate-400 mb-4">You don't have any saved characters yet.</p>
            <Link href="/character/create">
              <Button className="bg-amber-600 hover:bg-amber-700">Create New Character</Button>
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/character/create">
            <Button className="bg-amber-600 hover:bg-amber-700">Create New Character</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
