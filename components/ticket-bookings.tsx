"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Clock } from "lucide-react"

const tickets = [
  {
    id: 1,
    name: "Red Fort Entry Ticket",
    type: "Historical Monument",
    location: "Red Fort, Delhi",
    rating: 4.5,
    price: "₹35",
    duration: "2-3 hours",
    image: "/red-fort-historical-monument.jpg",
    description: "Explore the magnificent Mughal architecture and history",
    includes: ["Entry to all sections", "Audio guide", "Museum access"],
    timings: "9:30 AM - 4:30 PM",
    category: "Monument",
  },
  {
    id: 2,
    name: "Delhi Metro Day Pass",
    type: "Transportation",
    location: "All Metro Stations",
    rating: 4.7,
    price: "₹200",
    duration: "Full day",
    image: "/delhi-metro-modern-train.jpg",
    description: "Unlimited travel on Delhi Metro for one day",
    includes: ["All metro lines", "Airport Express", "Unlimited rides"],
    timings: "5:00 AM - 11:00 PM",
    category: "Transport",
  },
  {
    id: 3,
    name: "Lotus Temple Visit",
    type: "Spiritual Site",
    location: "Lotus Temple, Delhi",
    rating: 4.6,
    price: "Free",
    duration: "1-2 hours",
    image: "/lotus-temple-unique-architecture.jpg",
    description: "Visit the iconic lotus-shaped Bahai House of Worship",
    includes: ["Temple entry", "Meditation hall", "Garden access"],
    timings: "9:00 AM - 5:30 PM",
    category: "Spiritual",
  },
  {
    id: 4,
    name: "India Gate Light Show",
    type: "Entertainment",
    location: "India Gate, Delhi",
    rating: 4.4,
    price: "₹100",
    duration: "45 minutes",
    image: "/india-gate-evening-lights.jpg",
    description: "Evening light and sound show at India Gate",
    includes: ["Light show", "Historical narration", "Seating"],
    timings: "7:00 PM - 8:00 PM",
    category: "Entertainment",
  },
  {
    id: 5,
    name: "Qutub Minar Complex",
    type: "UNESCO World Heritage",
    location: "Mehrauli, Delhi",
    rating: 4.3,
    price: "₹40",
    duration: "2-3 hours",
    image: "/qutub-minar-unesco-heritage.jpg",
    description: "Explore the tallest brick minaret in the world",
    includes: ["Complex entry", "All monuments", "Garden access"],
    timings: "7:00 AM - 5:00 PM",
    category: "Heritage",
  },
  {
    id: 6,
    name: "Hop-on Hop-off Bus Tour",
    type: "City Tour",
    location: "Multiple locations",
    rating: 4.2,
    price: "₹500",
    duration: "Full day",
    image: "/hop-on-bus-city-tour.jpg",
    description: "Explore Delhi's major attractions with guided commentary",
    includes: ["24-hour pass", "Audio guide", "15+ stops"],
    timings: "9:00 AM - 6:00 PM",
    category: "Tour",
  },
]

const categoryColors = {
  Monument: "bg-amber-100 text-amber-800",
  Transport: "bg-blue-100 text-blue-800",
  Spiritual: "bg-purple-100 text-purple-800",
  Entertainment: "bg-pink-100 text-pink-800",
  Heritage: "bg-green-100 text-green-800",
  Tour: "bg-orange-100 text-orange-800",
}

export function TicketBookings() {
  const handleBookTicket = (ticketName: string) => {
    alert(`Booking ${ticketName}... This would redirect to ticket booking system.`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img src={ticket.image || "/placeholder.svg"} alt={ticket.name} className="w-full h-40 object-cover" />
            <div className="absolute top-3 left-3">
              <Badge className={categoryColors[ticket.category as keyof typeof categoryColors] || "bg-gray-100"}>
                {ticket.category}
              </Badge>
            </div>
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{ticket.rating}</span>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-foreground mb-1">{ticket.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="h-3 w-3" />
                {ticket.location}
              </div>
              <Badge variant="secondary" className="text-xs mb-2">
                {ticket.type}
              </Badge>
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
            </div>

            <div className="mb-3">
              <div className="text-xs font-medium text-foreground mb-1">Includes:</div>
              <div className="space-y-1">
                {ticket.includes.map((item, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {ticket.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {ticket.timings}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-primary">{ticket.price}</span>
              {ticket.price === "Free" && <Badge variant="secondary">No cost</Badge>}
            </div>

            <Button className="w-full" onClick={() => handleBookTicket(ticket.name)}>
              Book Ticket
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
