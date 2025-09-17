"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotelBookings } from "@/components/hotel-bookings"
import { RestaurantBookings } from "@/components/restaurant-bookings"
import { TicketBookings } from "@/components/ticket-bookings"
import { Hotel, Utensils, Ticket } from "lucide-react"

export function BookingTabs() {
  return (
    <Tabs defaultValue="hotels" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="hotels" className="flex items-center gap-2">
          <Hotel className="h-4 w-4" />
          Hotels
        </TabsTrigger>
        <TabsTrigger value="restaurants" className="flex items-center gap-2">
          <Utensils className="h-4 w-4" />
          Restaurants
        </TabsTrigger>
        <TabsTrigger value="tickets" className="flex items-center gap-2">
          <Ticket className="h-4 w-4" />
          Tickets
        </TabsTrigger>
      </TabsList>

      <TabsContent value="hotels">
        <HotelBookings />
      </TabsContent>

      <TabsContent value="restaurants">
        <RestaurantBookings />
      </TabsContent>

      <TabsContent value="tickets">
        <TicketBookings />
      </TabsContent>
    </Tabs>
  )
}
