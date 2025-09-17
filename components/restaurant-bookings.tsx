"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Users } from "lucide-react"

const restaurants = [
  {
    id: 1,
    name: "Spice Route",
    cuisine: "North Indian",
    location: "CP, Delhi",
    rating: 4.7,
    reviews: 2100,
    priceRange: "₹₹₹",
    image: "/indian-restaurant-traditional-decor.jpg",
    specialties: ["Butter Chicken", "Biryani", "Naan"],
    timing: "11:00 AM - 11:00 PM",
    description: "Authentic North Indian cuisine with traditional flavors",
  },
  {
    id: 2,
    name: "The Sushi Bar",
    cuisine: "Japanese",
    location: "Khan Market, Delhi",
    rating: 4.5,
    reviews: 850,
    priceRange: "₹₹₹₹",
    image: "/japanese-restaurant-modern-sushi-bar.jpg",
    specialties: ["Fresh Sushi", "Ramen", "Tempura"],
    timing: "12:00 PM - 10:30 PM",
    description: "Premium Japanese dining with fresh ingredients",
  },
  {
    id: 3,
    name: "Cafe Mocha",
    cuisine: "Continental",
    location: "Hauz Khas, Delhi",
    rating: 4.3,
    reviews: 1200,
    priceRange: "₹₹",
    image: "/cafe-cozy-interior-coffee-books.jpg",
    specialties: ["Coffee", "Pasta", "Sandwiches"],
    timing: "8:00 AM - 11:00 PM",
    description: "Cozy cafe perfect for casual dining and coffee",
  },
  {
    id: 4,
    name: "Royal Feast",
    cuisine: "Mughlai",
    location: "Old Delhi",
    rating: 4.6,
    reviews: 950,
    priceRange: "₹₹₹",
    image: "/mughlai-restaurant-royal-ambiance.jpg",
    specialties: ["Kebabs", "Korma", "Biryani"],
    timing: "12:00 PM - 11:00 PM",
    description: "Royal Mughlai cuisine in an elegant setting",
  },
  {
    id: 5,
    name: "Street Food Junction",
    cuisine: "Street Food",
    location: "Chandni Chowk, Delhi",
    rating: 4.4,
    reviews: 1800,
    priceRange: "₹",
    image: "/street-food-stall-colorful-snacks.jpg",
    specialties: ["Chaat", "Golgappa", "Chole Bhature"],
    timing: "10:00 AM - 10:00 PM",
    description: "Authentic Delhi street food experience",
  },
  {
    id: 6,
    name: "Garden Terrace",
    cuisine: "Multi-cuisine",
    location: "Lodhi Gardens, Delhi",
    rating: 4.5,
    reviews: 720,
    priceRange: "₹₹₹",
    image: "/garden-restaurant-outdoor-terrace.jpg",
    specialties: ["Grilled Items", "Salads", "Mocktails"],
    timing: "11:00 AM - 11:30 PM",
    description: "Beautiful garden setting with diverse menu",
  },
]

export function RestaurantBookings() {
  const handleBookTable = (restaurantName: string) => {
    alert(`Booking table at ${restaurantName}... This would open reservation system.`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-40 object-cover"
            />
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-foreground">{restaurant.name}</h3>
                <span className="text-sm font-medium text-primary">{restaurant.priceRange}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="h-3 w-3" />
                {restaurant.location}
              </div>
              <Badge variant="secondary" className="text-xs mb-2">
                {restaurant.cuisine}
              </Badge>
              <p className="text-sm text-muted-foreground">{restaurant.description}</p>
            </div>

            <div className="mb-3">
              <div className="text-xs font-medium text-foreground mb-1">Specialties:</div>
              <div className="flex flex-wrap gap-1">
                {restaurant.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {restaurant.timing}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {restaurant.reviews} reviews
              </div>
            </div>

            <Button className="w-full" onClick={() => handleBookTable(restaurant.name)}>
              Book Table
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
