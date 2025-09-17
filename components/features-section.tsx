import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, CreditCard, Shield } from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Smart Transport",
    description: "Find buses, autos, and taxis with real-time tracking and fare estimates.",
  },
  {
    icon: Calendar,
    title: "AI Itinerary",
    description: "Get personalized travel plans based on your budget and time preferences.",
  },
  {
    icon: CreditCard,
    title: "Easy Booking",
    description: "Book hotels, restaurants, and tickets all in one place with secure payments.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Emergency SOS feature and real-time safety updates for peace of mind.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need for Travel</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            LOKWAY combines all essential travel tools in one seamless experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
