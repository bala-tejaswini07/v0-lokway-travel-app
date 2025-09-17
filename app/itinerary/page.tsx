import { LayoutWrapper } from "@/components/layout-wrapper"
import { ItineraryForm } from "@/components/itinerary-form"
import { ItineraryResults } from "@/components/itinerary-results"

export default function ItineraryPage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Plan Your Perfect Itinerary</h1>
          <p className="text-muted-foreground">Tell us your preferences and we'll create a personalized travel plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ItineraryForm />
          </div>
          <div>
            <ItineraryResults />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
