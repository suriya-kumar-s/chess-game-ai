"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CharacterCreationPage() {
  const router = useRouter()
  const [character, setCharacter] = useState({
    name: "",
    race: "",
    class: "",
    alignment: "",
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  })

  const handleChange = (field: string, value: string | number) => {
    setCharacter((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // In a real app, we would save the character to a database or local storage
    console.log("Character created:", character)
    router.push("/game")
  }

  const rollAbilityScore = () => {
    // Simulate rolling 4d6 and dropping the lowest die
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
    rolls.sort((a, b) => a - b)
    return rolls.slice(1).reduce((sum, roll) => sum + roll, 0)
  }

  const rollAllAbilities = () => {
    setCharacter((prev) => ({
      ...prev,
      strength: rollAbilityScore(),
      dexterity: rollAbilityScore(),
      constitution: rollAbilityScore(),
      intelligence: rollAbilityScore(),
      wisdom: rollAbilityScore(),
      charisma: rollAbilityScore(),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back to Home
          </Button>
        </Link>

        <h1 className="mb-6 text-3xl font-bold">Character Creation</h1>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="abilities">Abilities</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription className="text-slate-300">Enter your character's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Character Name</Label>
                  <Input
                    id="name"
                    value={character.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="race">Race</Label>
                  <Select value={character.race} onValueChange={(value) => handleChange("race", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select a race" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="human">Human</SelectItem>
                      <SelectItem value="elf">Elf</SelectItem>
                      <SelectItem value="dwarf">Dwarf</SelectItem>
                      <SelectItem value="halfling">Halfling</SelectItem>
                      <SelectItem value="gnome">Gnome</SelectItem>
                      <SelectItem value="half-orc">Half-Orc</SelectItem>
                      <SelectItem value="half-elf">Half-Elf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={character.class} onValueChange={(value) => handleChange("class", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="fighter">Fighter</SelectItem>
                      <SelectItem value="wizard">Wizard</SelectItem>
                      <SelectItem value="cleric">Cleric</SelectItem>
                      <SelectItem value="rogue">Rogue</SelectItem>
                      <SelectItem value="ranger">Ranger</SelectItem>
                      <SelectItem value="paladin">Paladin</SelectItem>
                      <SelectItem value="barbarian">Barbarian</SelectItem>
                      <SelectItem value="bard">Bard</SelectItem>
                      <SelectItem value="druid">Druid</SelectItem>
                      <SelectItem value="monk">Monk</SelectItem>
                      <SelectItem value="sorcerer">Sorcerer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alignment">Alignment</Label>
                  <RadioGroup
                    value={character.alignment}
                    onValueChange={(value) => handleChange("alignment", value)}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lawful-good" id="lawful-good" />
                      <Label htmlFor="lawful-good">Lawful Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral-good" id="neutral-good" />
                      <Label htmlFor="neutral-good">Neutral Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chaotic-good" id="chaotic-good" />
                      <Label htmlFor="chaotic-good">Chaotic Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lawful-neutral" id="lawful-neutral" />
                      <Label htmlFor="lawful-neutral">Lawful Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true-neutral" id="true-neutral" />
                      <Label htmlFor="true-neutral">True Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chaotic-neutral" id="chaotic-neutral" />
                      <Label htmlFor="chaotic-neutral">Chaotic Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lawful-evil" id="lawful-evil" />
                      <Label htmlFor="lawful-evil">Lawful Evil</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral-evil" id="neutral-evil" />
                      <Label htmlFor="neutral-evil">Neutral Evil</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chaotic-evil" id="chaotic-evil" />
                      <Label htmlFor="chaotic-evil">Chaotic Evil</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abilities">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle>Ability Scores</CardTitle>
                <CardDescription className="text-slate-300">Set your character's ability scores</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={rollAllAbilities} className="mb-6 bg-amber-600 hover:bg-amber-700">
                  Roll All Abilities (4d6 drop lowest)
                </Button>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="strength">Strength</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="strength"
                        type="number"
                        value={character.strength}
                        onChange={(e) => handleChange("strength", Number.parseInt(e.target.value))}
                        className="bg-slate-700 border-slate-600"
                      />
                      <div className="text-lg font-bold">
                        {Math.floor((character.strength - 10) / 2) >= 0
                          ? `+${Math.floor((character.strength - 10) / 2)}`
                          : Math.floor((character.strength - 10) / 2)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dexterity">Dexterity</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="dexterity"
                        type="number"
                        value={character.dexterity}
                        onChange={(e) => handleChange("dexterity", Number.parseInt(e.target.value))}
                        className="bg-slate-700 border-slate-600"
                      />
                      <div className="text-lg font-bold">
                        {Math.floor((character.dexterity - 10) / 2) >= 0
                          ? `+${Math.floor((character.dexterity - 10) / 2)}`
                          : Math.floor((character.dexterity - 10) / 2)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="constitution">Constitution</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="constitution"
                        type="number"
                        value={character.constitution}
                        onChange={(e) => handleChange("constitution", Number.parseInt(e.target.value))}
                        className="bg-slate-700 border-slate-600"
                      />
                      <div className="text-lg font-bold">
                        {Math.floor((character.constitution - 10) / 2) >= 0
                          ? `+${Math.floor((character.constitution - 10) / 2)}`
                          : Math.floor((character.constitution - 10) / 2)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intelligence">Intelligence</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="intelligence"
                        type="number"
                        value={character.intelligence}
                        onChange={(e) => handleChange("intelligence", Number.parseInt(e.target.value))}
                        className="bg-slate-700 border-slate-600"
                      />
                      <div className="text-lg font-bold">
                        {Math.floor((character.intelligence - 10) / 2) >= 0
                          ? `+${Math.floor((character.intelligence - 10) / 2)}`
                          : Math.floor((character.intelligence - 10) / 2)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wisdom">Wisdom</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="wisdom"
                        type="number"
                        value={character.wisdom}
                        onChange={(e) => handleChange("wisdom", Number.parseInt(e.target.value))}
                        className="bg-slate-700 border-slate-600"
                      />
                      <div className="text-lg font-bold">
                        {Math.floor((character.wisdom - 10) / 2) >= 0
                          ? `+${Math.floor((character.wisdom - 10) / 2)}`
                          : Math.floor((character.wisdom - 10) / 2)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="charisma">Charisma</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="charisma"
                        type="number"
                        value={character.charisma}
                        onChange={(e) => handleChange("charisma", Number.parseInt(e.target.value))}
                        className="bg-slate-700 border-slate-600"
                      />
                      <div className="text-lg font-bold">
                        {Math.floor((character.charisma - 10) / 2) >= 0
                          ? `+${Math.floor((character.charisma - 10) / 2)}`
                          : Math.floor((character.charisma - 10) / 2)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle>Equipment</CardTitle>
                <CardDescription className="text-slate-300">Choose your character's starting equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-300">
                  Your starting equipment will be based on your class selection. Additional equipment can be purchased
                  with starting gold.
                </p>

                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg border-slate-600 bg-slate-700">
                    <h3 className="mb-2 font-semibold">Weapons</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="weapon1" className="mr-2" />
                        <Label htmlFor="weapon1">Longsword (15 gp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="weapon2" className="mr-2" />
                        <Label htmlFor="weapon2">Shortbow (30 gp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="weapon3" className="mr-2" />
                        <Label htmlFor="weapon3">Dagger (2 gp)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg border-slate-600 bg-slate-700">
                    <h3 className="mb-2 font-semibold">Armor</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="armor1" className="mr-2" />
                        <Label htmlFor="armor1">Leather Armor (10 gp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="armor2" className="mr-2" />
                        <Label htmlFor="armor2">Chain Shirt (100 gp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="armor3" className="mr-2" />
                        <Label htmlFor="armor3">Shield (10 gp)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg border-slate-600 bg-slate-700">
                    <h3 className="mb-2 font-semibold">Adventuring Gear</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="gear1" className="mr-2" />
                        <Label htmlFor="gear1">Backpack (2 gp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="gear2" className="mr-2" />
                        <Label htmlFor="gear2">Bedroll (1 sp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="gear3" className="mr-2" />
                        <Label htmlFor="gear3">Rope, hemp (50 ft) (1 gp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="gear4" className="mr-2" />
                        <Label htmlFor="gear4">Rations (1 day) (5 sp)</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="gear5" className="mr-2" />
                        <Label htmlFor="gear5">Waterskin (2 sp)</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <CardFooter className="flex justify-between mt-6 px-0">
            <Button variant="outline">Save Character</Button>
            <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
              Complete & Start Adventure
            </Button>
          </CardFooter>
        </Tabs>
      </div>
    </div>
  )
}
