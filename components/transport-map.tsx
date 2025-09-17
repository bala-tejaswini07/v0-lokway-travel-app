"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Zap } from "lucide-react"

// Mock transport data
const transportData = [
  { id: 1, type: "bus", lat: 28.6139, lng: 77.209, name: "DTC Bus 543", eta: "5 min" },
  { id: 2, type: "auto", lat: 28.6129, lng: 77.2295, name: "Auto Rickshaw", eta: "2 min" },
  { id: 3, type: "taxi", lat: 28.6169, lng: 77.2265, name: "Ola Cab", eta: "8 min" },
  { id: 4, type: "bus", lat: 28.6149, lng: 77.219, name: "Cluster Bus AC", eta: "12 min" },
  { id: 5, type: "auto", lat: 28.6119, lng: 77.2195, name: "Auto Rickshaw", eta: "3 min" },
]

export function TransportMap() {
  const [selectedTransport, setSelectedTransport] = useState<number | null>(null)

  return (
    <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Mock street lines */}
            <line x1="0" y1="100" x2="400" y2="100" stroke="#666" strokeWidth="2" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="#666" strokeWidth="2" />
            <line x1="100" y1="0" x2="100" y2="300" stroke="#666" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#666" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="300" stroke="#666" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Transport Markers */}
      {transportData.map((transport) => (
        <div
          key={transport.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${(transport.lng - 77.209) * 1000 + 200}px`,
            top: `${(28.6139 - transport.lat) * 1000 + 150}px`,
          }}
          onClick={() => setSelectedTransport(transport.id)}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
              transport.type === "bus"
                ? "bg-blue-500 text-white"
                : transport.type === "auto"
                  ? "bg-yellow-500 text-white"
                  : "bg-green-500 text-white"
            } ${selectedTransport === transport.id ? "scale-125 ring-4 ring-white" : "hover:scale-110"}`}
          >
            {transport.type === "bus" ? "🚌" : transport.type === "auto" ? "🛺" : "🚗"}
          </div>
          {selectedTransport === transport.id && (
            <Card className="absolute top-10 left-1/2 transform -translate-x-1/2 p-3 min-w-48 z-10">
              <div className="text-sm">
                <div className="font-semibold">{transport.name}</div>
                <div className="text-muted-foreground">ETA: {transport.eta}</div>
                <Button size="sm" className="w-full mt-2">
                  <Navigation className="h-3 w-3 mr-1" />
                  Navigate
                </Button>
              </div>
            </Card>
          )}
        </div>
      ))}

      {/* Current Location Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse">
          <div className="w-8 h-8 bg-primary/20 rounded-full absolute -top-2 -left-2 animate-ping" />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" className="bg-card shadow-lg">
          <Zap className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="bg-card shadow-lg">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card p-3 rounded-lg shadow-lg">
        <div className="text-xs font-medium mb-2">Transport Types</div>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            Bus
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            Auto
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            Taxi
          </div>
        </div>
      </div>
    </div>
  )
}
