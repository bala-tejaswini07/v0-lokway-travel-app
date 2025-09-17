import { LayoutWrapper } from "@/components/layout-wrapper"
import { BookingTabs } from "@/components/booking-tabs"

export default function BookingsPage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book Your Travel Essentials</h1>
          <p className="text-muted-foreground">Hotels, restaurants, and tickets - all in one place</p>
        </div>

        <BookingTabs />
      </div>
    </LayoutWrapper>
  )
}
