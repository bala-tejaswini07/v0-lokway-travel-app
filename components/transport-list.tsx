"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Navigation, Star, Users } from "lucide-react"

const transportOptions = [
  {
    id: 1,
    type: "bus",
    name: "DTC Bus 543",
    route: "Connaught Place → India Gate",
    eta: "5 min",
    fare: "₹15",
    rating: 4.2,
    capacity: "Available seats",
    icon: "🚌",
    color: "bg-blue-500",
  },
  {
    id: 2,
    type: "auto",
    name: "Auto Rickshaw",
    route: "Current Location → Destination",
    eta: "2 min",
    fare: "₹45",
    rating: 4.5,
    capacity: "2 seats",
    icon: "🛺",
    color: "bg-yellow-500",
  },
  {
    id: 3,
    type: "taxi",
    name: "Ola Cab - Sedan",
    route: "Current Location → Destination",
    eta: "8 min",
    fare: "₹120",
    rating: 4.7,
    capacity: "4 seats",
    icon: "🚗",
    color: "bg-green-500",
  },
  {
    id: 4,
    type: "bus",
    name: "Cluster Bus AC",
    route: "Rajiv Chowk → AIIMS",
    eta: "12 min",
    fare: "₹25",
    rating: 4.0,
    capacity: "Available seats",
    icon: "🚌",
    color: "bg-blue-500",
  },
  {
    id: 5,
    type: "auto",
    name: "Auto Rickshaw",
    route: "Current Location → Destination",
    eta: "3 min",
    fare: "₹40",
    rating: 4.3,
    capacity: "3 seats",
    icon: "🛺",
    color: "bg-yellow-500",
  },
  {
    id: 6,
    type: "taxi",
    name: "Uber Go",
    route: "Current Location → Destination",
    eta: "6 min",
    fare: "₹95",
    rating: 4.6,
    capacity: "4 seats",
    icon: "🚗",
    color: "bg-green-500",
  },
]

export function TransportList() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Available Transport</h2>
        <Badge variant="secondary">{transportOptions.length} options</Badge>
      </div>

      <div className="space-y-3">
        {transportOptions.map((transport) => (
          <Card key={transport.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${transport.color} rounded-lg flex items-center justify-center text-white text-lg`}
                  >
                    {transport.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{transport.name}</h3>
                    <p className="text-sm text-muted-foreground">{transport.route}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{transport.fare}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {transport.rating}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {transport.eta}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {transport.capacity}
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Navigate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
