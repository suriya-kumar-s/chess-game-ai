"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Minus, Plus } from "lucide-react"

export function GameMap() {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  // Sample map grid data - in a real app, this would come from a game state or API
  const mapGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 0, 0, 0, 3, 3, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 0, 0, 0, 3, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 5, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]

  // Map tile types
  const tileTypes = {
    0: { color: "#6b7280", name: "Floor" }, // Empty floor
    1: { color: "#374151", name: "Wall" }, // Wall
    2: { color: "#7c3aed", name: "Magic Circle" }, // Magic circle
    3: { color: "#a78bfa", name: "Bookshelf" }, // Bookshelf
    4: { color: "#f59e0b", name: "Player" }, // Player character
    5: { color: "#ef4444", name: "Goblin" }, // Enemy
    6: { color: "#10b981", name: "Treasure" }, // Treasure
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const moveMap = (direction: string) => {
    const moveAmount = 50
    switch (direction) {
      case "up":
        setPosition((prev) => ({ ...prev, y: prev.y + moveAmount }))
        break
      case "down":
        setPosition((prev) => ({ ...prev, y: prev.y - moveAmount }))
        break
      case "left":
        setPosition((prev) => ({ ...prev, x: prev.x + moveAmount }))
        break
      case "right":
        setPosition((prev) => ({ ...prev, x: prev.x - moveAmount }))
        break
    }
  }

  useEffect(() => {
    // Center the map initially
    if (mapRef.current) {
      const { width, height } = mapRef.current.getBoundingClientRect()
      setPosition({
        x: width / 2 - (mapGrid[0].length * 40 * zoom) / 2,
        y: height / 2 - (mapGrid.length * 40 * zoom) / 2,
      })
    }
  }, [])

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-slate-900">
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {mapGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className="w-10 h-10 border border-slate-800 flex items-center justify-center text-xs"
                  style={{ backgroundColor: tileTypes[cell as keyof typeof tileTypes].color }}
                  title={tileTypes[cell as keyof typeof tileTypes].name}
                >
                  {cell === 4 && "P"}
                  {cell === 5 && "G"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" onClick={handleZoomIn}>
          <Plus className="h-4 w-4" />
        </Button>
        <Slider
          value={[zoom * 100]}
          min={50}
          max={200}
          step={10}
          orientation="vertical"
          className="h-24"
          onValueChange={(value) => setZoom(value[0] / 100)}
        />
        <Button size="icon" variant="secondary" onClick={handleZoomOut}>
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 grid grid-cols-3 gap-1">
        <div></div>
        <Button size="icon" variant="secondary" onClick={() => moveMap("up")}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <div></div>
        <Button size="icon" variant="secondary" onClick={() => moveMap("left")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={() => moveMap("down")}>
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={() => moveMap("right")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 bg-slate-800 p-2 rounded-md text-sm">
        <div className="font-bold">Goblin Cave</div>
        <div className="text-xs text-slate-400">Encounter Level: 1</div>
      </div>
    </div>
  )
}
