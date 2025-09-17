"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star, Camera, Utensils, Car } from "lucide-react"

const sampleItinerary = [
  {
    day: 1,
    title: "Historic Delhi Discovery",
    places: [
      {
        name: "Red Fort",
        time: "9:00 AM - 11:00 AM",
        duration: "2 hours",
        type: "Historical",
        rating: 4.5,
        description: "Explore the magnificent Mughal architecture",
        cost: "₹35",
      },
      {
        name: "Chandni Chowk",
        time: "11:30 AM - 1:30 PM",
        duration: "2 hours",
        type: "Shopping & Food",
        rating: 4.3,
        description: "Experience the bustling old market and street food",
        cost: "₹500",
      },
      {
        name: "India Gate",
        time: "4:00 PM - 6:00 PM",
        duration: "2 hours",
        type: "Monument",
        rating: 4.4,
        description: "Visit the iconic war memorial",
        cost: "Free",
      },
    ],
  },
  {
    day: 2,
    title: "Modern Delhi & Culture",
    places: [
      {
        name: "Lotus Temple",
        time: "9:00 AM - 10:30 AM",
        duration: "1.5 hours",
        type: "Spiritual",
        rating: 4.6,
        description: "Marvel at the unique lotus-shaped architecture",
        cost: "Free",
      },
      {
        name: "Humayun's Tomb",
        time: "11:00 AM - 12:30 PM",
        duration: "1.5 hours",
        type: "Historical",
        rating: 4.5,
        description: "UNESCO World Heritage Site with beautiful gardens",
        cost: "₹40",
      },
      {
        name: "Connaught Place",
        time: "2:00 PM - 5:00 PM",
        duration: "3 hours",
        type: "Shopping",
        rating: 4.2,
        description: "Shop and dine in the heart of New Delhi",
        cost: "₹1000",
      },
    ],
  },
]

const typeIcons = {
  Historical: Camera,
  "Shopping & Food": Utensils,
  Monument: MapPin,
  Spiritual: Star,
  Shopping: Utensils,
}

const typeColors = {
  Historical: "bg-amber-100 text-amber-800",
  "Shopping & Food": "bg-orange-100 text-orange-800",
  Monument: "bg-blue-100 text-blue-800",
  Spiritual: "bg-purple-100 text-purple-800",
  Shopping: "bg-green-100 text-green-800",
}

export function ItineraryResults() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Personalized Itinerary</span>
            <Badge variant="secondary">2 Days</Badge>
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Total Budget: ₹1,575</span>
            <span>•</span>
            <span>6 Places</span>
          </div>
        </CardHeader>
      </Card>

      {sampleItinerary.map((day) => (
        <Card key={day.day}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {day.day}
              </div>
              {day.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {day.places.map((place, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{place.name}</h4>
                      <Badge
                        variant="secondary"
                        className={typeColors[place.type as keyof typeof typeColors] || "bg-gray-100 text-gray-800"}
                      >
                        {place.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{place.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {place.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {place.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{place.cost}</div>
                    <div className="text-xs text-muted-foreground">{place.duration}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <MapPin className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Car className="h-3 w-3 mr-1" />
                    Book Transport
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Love this itinerary?</h4>
              <p className="text-sm text-muted-foreground">Save it to your bookings</p>
            </div>
            <Button>Save Itinerary</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
