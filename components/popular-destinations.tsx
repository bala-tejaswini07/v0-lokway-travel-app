import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"

const destinations = [
  {
    name: "Goa",
    image: "/beautiful-goa-beach-with-palm-trees.jpg",
    rating: 4.8,
    price: "₹2,500",
    description: "Pristine beaches and vibrant nightlife",
  },
  {
    name: "Kerala",
    image: "/kerala-backwaters-with-traditional-houseboat.jpg",
    rating: 4.9,
    price: "₹3,200",
    description: "Backwaters and lush green landscapes",
  },
  {
    name: "Rajasthan",
    image: "/rajasthan-palace-with-desert-landscape.jpg",
    rating: 4.7,
    price: "₹2,800",
    description: "Royal palaces and desert adventures",
  },
  {
    name: "Himachal",
    image: "/himachal-pradesh-mountains-with-snow-peaks.jpg",
    rating: 4.6,
    price: "₹3,500",
    description: "Mountain peaks and serene valleys",
  },
]

export function PopularDestinations() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Popular Destinations</h2>
          <p className="text-lg text-muted-foreground">Discover the most loved travel destinations in India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{destination.rating}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{destination.name}</h3>
                  <span className="text-lg font-bold text-primary">{destination.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{destination.description}</p>
                <Button className="w-full bg-transparent" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
