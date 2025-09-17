"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/transport?destination=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Hero Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            Your Journey Starts with <span className="text-primary">LOKWAY</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover, plan, and navigate your travels with ease. From transport to itineraries, we've got you covered.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-card rounded-xl shadow-lg border border-border p-2">
            <MapPin className="h-5 w-5 text-muted-foreground ml-3" />
            <Input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Button onClick={handleSearch} className="rounded-lg px-6">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="px-8 py-3 text-lg" onClick={() => router.push("/transport")}>
            Find Transport
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg bg-transparent"
            onClick={() => router.push("/itinerary")}
          >
            Plan Itinerary
          </Button>
        </div>

        {/* Hero Image */}
        <div className="mt-12">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/beautiful-travel-destination-with-mountains-and-cl.jpg"
              alt="Beautiful travel destination"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
