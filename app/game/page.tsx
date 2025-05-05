"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiceRoller } from "@/components/dice-roller"
import { CharacterSheet } from "@/components/character-sheet"
import { GameMap } from "@/components/game-map"

export default function GamePage() {
  const [activeTab, setActiveTab] = useState("map")

  // Sample character data - in a real app, this would come from storage or context
  const character = {
    name: "Thorin Oakenshield",
    race: "Dwarf",
    class: "Fighter",
    level: 1,
    alignment: "Lawful Good",
    attributes: {
      strength: 16,
      dexterity: 12,
      constitution: 14,
      intelligence: 10,
      wisdom: 13,
      charisma: 8,
    },
    hp: {
      current: 12,
      max: 12,
    },
    ac: 16,
    skills: [
      { name: "Acrobatics", modifier: 1 },
      { name: "Animal Handling", modifier: 1 },
      { name: "Arcana", modifier: 0 },
      { name: "Athletics", modifier: 3 },
      { name: "Deception", modifier: -1 },
      { name: "History", modifier: 0 },
      { name: "Insight", modifier: 1 },
      { name: "Intimidation", modifier: -1 },
      { name: "Investigation", modifier: 0 },
      { name: "Medicine", modifier: 1 },
      { name: "Nature", modifier: 0 },
      { name: "Perception", modifier: 1 },
      { name: "Performance", modifier: -1 },
      { name: "Persuasion", modifier: -1 },
      { name: "Religion", modifier: 0 },
      { name: "Sleight of Hand", modifier: 1 },
      { name: "Stealth", modifier: 1 },
      { name: "Survival", modifier: 1 },
    ],
    equipment: [
      "Longsword",
      "Shield",
      "Chain Mail",
      "Backpack",
      "Bedroll",
      "Rations (10 days)",
      "Waterskin",
      "20 gold pieces",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <h1 className="text-2xl font-bold">Pathfinder Adventure</h1>
          <Button variant="outline">Save Game</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700 text-white lg:col-span-1">
            <CardContent className="p-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">{character.name}</h2>
                <div className="text-sm text-slate-300">
                  Level {character.level} {character.race} {character.class}
                </div>
                <div className="mt-2 flex gap-4">
                  <div>
                    <span className="text-xs text-slate-400">HP</span>
                    <div className="text-lg font-bold">
                      {character.hp.current}/{character.hp.max}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">AC</span>
                    <div className="text-lg font-bold">{character.ac}</div>
                  </div>
                </div>
              </div>

              <DiceRoller />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-slate-700">
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="character">Character Sheet</TabsTrigger>
                <TabsTrigger value="journal">Journal</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="p-0">
                <GameMap />
              </TabsContent>

              <TabsContent value="character">
                <CharacterSheet character={character} />
              </TabsContent>

              <TabsContent value="journal">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Adventure Journal</h2>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg border-slate-600 bg-slate-700">
                      <h3 className="font-semibold">Day 1: The Beginning</h3>
                      <p className="text-slate-300 mt-2">
                        You arrive at the small village of Sandpoint, just in time for the annual Swallowtail Festival.
                        The town is bustling with activity as locals prepare for the celebration.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg border-slate-600 bg-slate-700">
                      <h3 className="font-semibold">Current Quest: The Goblin Raid</h3>
                      <p className="text-slate-300 mt-2">
                        During the festival, a band of goblins attacked the town. After helping defend the villagers,
                        you've been asked to investigate where the goblins came from and why they attacked.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg border-slate-600 bg-slate-700">
                      <h3 className="font-semibold">Notes</h3>
                      <textarea
                        className="w-full h-32 mt-2 p-2 bg-slate-600 border-slate-500 rounded-md text-white"
                        placeholder="Write your adventure notes here..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Game Master's Narration</h2>
          <div className="p-3 bg-slate-700 rounded-md mb-3 text-slate-300">
            As you approach the goblin cave, you can hear the faint sounds of goblins chattering and cackling from
            within. The entrance is partially hidden by overgrown vines and brambles, but a well-worn path leads inside.
            The air smells of smoke and something foul. What would you like to do?
          </div>

          <div className="flex gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Enter the cave</Button>
            <Button variant="outline">Scout the surroundings</Button>
            <Button variant="outline">Check equipment</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
