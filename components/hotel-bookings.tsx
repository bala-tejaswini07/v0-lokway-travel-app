"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Coffee, Waves } from "lucide-react"

const hotels = [
  {
    id: 1,
    name: "The Grand Palace Hotel",
    location: "Connaught Place, Delhi",
    rating: 4.8,
    reviews: 1250,
    price: "₹8,500",
    originalPrice: "₹12,000",
    image: "/luxury-hotel-with-grand-architecture.jpg",
    amenities: ["Free WiFi", "Parking", "Restaurant", "Pool"],
    description: "Luxury hotel in the heart of Delhi with world-class amenities",
    discount: "30% OFF",
  },
  {
    id: 2,
    name: "Boutique Stay Delhi",
    location: "Khan Market, Delhi",
    rating: 4.6,
    reviews: 890,
    price: "₹4,200",
    originalPrice: "₹5,500",
    image: "/boutique-hotel-modern-design.jpg",
    amenities: ["Free WiFi", "Breakfast", "AC"],
    description: "Modern boutique hotel with personalized service",
    discount: "25% OFF",
  },
  {
    id: 3,
    name: "Heritage Inn",
    location: "Old Delhi",
    rating: 4.4,
    reviews: 650,
    price: "₹2,800",
    originalPrice: "₹3,500",
    image: "/heritage-hotel-traditional-architecture.jpg",
    amenities: ["Free WiFi", "Restaurant", "Heritage Tours"],
    description: "Experience traditional Delhi in this heritage property",
    discount: "20% OFF",
  },
  {
    id: 4,
    name: "Business Suites",
    location: "Gurgaon",
    rating: 4.5,
    reviews: 420,
    price: "₹6,000",
    originalPrice: "₹7,500",
    image: "/business-hotel-modern-suites.jpg",
    amenities: ["Free WiFi", "Business Center", "Gym", "Parking"],
    description: "Perfect for business travelers with modern facilities",
    discount: "20% OFF",
  },
]

const amenityIcons = {
  "Free WiFi": Wifi,
  Parking: Car,
  Restaurant: Coffee,
  Pool: Waves,
  Breakfast: Coffee,
  AC: Coffee,
  "Heritage Tours": MapPin,
  "Business Center": Coffee,
  Gym: Coffee,
}

export function HotelBookings() {
  const handleBookNow = (hotelName: string) => {
    alert(`Booking ${hotelName}... This would redirect to payment gateway.`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-48 object-cover" />
            <div className="absolute top-3 left-3">
              <Badge className="bg-destructive text-destructive-foreground">{hotel.discount}</Badge>
            </div>
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{hotel.rating}</span>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-foreground mb-1">{hotel.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                {hotel.location}
              </div>
              <p className="text-sm text-muted-foreground">{hotel.description}</p>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {hotel.amenities.slice(0, 4).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{hotel.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{hotel.originalPrice}</span>
                </div>
                <div className="text-xs text-muted-foreground">per night</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{hotel.reviews} reviews</div>
              </div>
            </div>

            <Button className="w-full" onClick={() => handleBookNow(hotel.name)}>
              Book Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
