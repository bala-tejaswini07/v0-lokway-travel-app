"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bus, Car, Bike } from "lucide-react"

const transportTypes = [
  { id: "all", label: "All", icon: null },
  { id: "bus", label: "Bus", icon: Bus },
  { id: "auto", label: "Auto", icon: Bike },
  { id: "taxi", label: "Taxi", icon: Car },
]

export function TransportFilters() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="flex flex-wrap gap-2">
      {transportTypes.map((type) => (
        <Button
          key={type.id}
          variant={activeFilter === type.id ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter(type.id)}
          className="flex items-center gap-2"
        >
          {type.icon && <type.icon className="h-4 w-4" />}
          {type.label}
          {activeFilter === type.id && (
            <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
              12
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}
