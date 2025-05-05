"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface CharacterAttribute {
  name: string
  value: number
  modifier: number
}

interface CharacterSkill {
  name: string
  modifier: number
}

interface CharacterProps {
  character: {
    name: string
    race: string
    class: string
    level: number
    alignment: string
    attributes: {
      strength: number
      dexterity: number
      constitution: number
      intelligence: number
      wisdom: number
      charisma: number
    }
    hp: {
      current: number
      max: number
    }
    ac: number
    skills: CharacterSkill[]
    equipment: string[]
  }
}

export function CharacterSheet({ character }: CharacterProps) {
  // Calculate attribute modifiers
  const getModifier = (attributeValue: number) => {
    return Math.floor((attributeValue - 10) / 2)
  }

  const attributes: CharacterAttribute[] = [
    { name: "STR", value: character.attributes.strength, modifier: getModifier(character.attributes.strength) },
    { name: "DEX", value: character.attributes.dexterity, modifier: getModifier(character.attributes.dexterity) },
    { name: "CON", value: character.attributes.constitution, modifier: getModifier(character.attributes.constitution) },
    { name: "INT", value: character.attributes.intelligence, modifier: getModifier(character.attributes.intelligence) },
    { name: "WIS", value: character.attributes.wisdom, modifier: getModifier(character.attributes.wisdom) },
    { name: "CHA", value: character.attributes.charisma, modifier: getModifier(character.attributes.charisma) },
  ]

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Character Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-slate-400">Name:</span>
                <div className="font-semibold">{character.name}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Race:</span>
                <div>{character.race}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Class:</span>
                <div>{character.class}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Level:</span>
                <div>{character.level}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Alignment:</span>
                <div>{character.alignment}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Combat Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-400">Hit Points:</span>
                <div className="flex items-center gap-2">
                  <Progress value={(character.hp.current / character.hp.max) * 100} className="h-2" />
                  <span className="font-bold">
                    {character.hp.current}/{character.hp.max}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Armor Class:</span>
                <div className="font-bold text-xl">{character.ac}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Initiative:</span>
                <div className="font-bold">
                  {getModifier(character.attributes.dexterity) >= 0
                    ? `+${getModifier(character.attributes.dexterity)}`
                    : getModifier(character.attributes.dexterity)}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Speed:</span>
                <div>30 ft.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {attributes.map((attr) => (
                <div key={attr.name} className="text-center p-2 bg-slate-800 rounded-lg">
                  <div className="text-sm text-slate-400">{attr.name}</div>
                  <div className="font-bold">{attr.value}</div>
                  <div className="text-sm">{attr.modifier >= 0 ? `+${attr.modifier}` : attr.modifier}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-700">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="spells">Abilities & Spells</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-4">
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {character.skills.map((skill) => (
                  <div key={skill.name} className="flex justify-between p-2 bg-slate-800 rounded-lg">
                    <span>{skill.name}</span>
                    <span className="font-bold">{skill.modifier >= 0 ? `+${skill.modifier}` : skill.modifier}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="mt-4">
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="pt-4">
              <div className="space-y-2">
                {character.equipment.map((item, index) => (
                  <div key={index} className="p-2 bg-slate-800 rounded-lg">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spells" className="mt-4">
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Class Features</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <div className="font-medium">Second Wind</div>
                      <div className="text-sm text-slate-300">
                        You have a limited well of stamina that you can draw on to protect yourself from harm. On your
                        turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.
                      </div>
                    </div>
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <div className="font-medium">Fighting Style: Defense</div>
                      <div className="text-sm text-slate-300">
                        While you are wearing armor, you gain a +1 bonus to AC.
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Racial Traits</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <div className="font-medium">Darkvision</div>
                      <div className="text-sm text-slate-300">
                        You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if
                        it were dim light.
                      </div>
                    </div>
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <div className="font-medium">Dwarven Resilience</div>
                      <div className="text-sm text-slate-300">
                        You have advantage on saving throws against poison, and you have resistance against poison
                        damage.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
