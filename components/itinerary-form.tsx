"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar, DollarSign, Clock, Sparkles } from "lucide-react"

export function ItineraryForm() {
  const [formData, setFormData] = useState({
    city: "",
    budget: "",
    duration: "",
    interests: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log("Generating itinerary with:", formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Create Your Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* City Selection */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Select City
            </Label>
            <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="goa">Goa</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="himachal">Himachal Pradesh</SelectItem>
                <SelectItem value="kashmir">Kashmir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Selection */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget Range
            </Label>
            <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (₹5,000 - ₹15,000)</SelectItem>
                <SelectItem value="mid">Mid-range (₹15,000 - ₹35,000)</SelectItem>
                <SelectItem value="luxury">Luxury (₹35,000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Trip Duration
            </Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger>
                <SelectValue placeholder="How long is your trip?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2">1-2 Days</SelectItem>
                <SelectItem value="3-5">3-5 Days</SelectItem>
                <SelectItem value="1-week">1 Week</SelectItem>
                <SelectItem value="2-weeks">2 Weeks</SelectItem>
                <SelectItem value="1-month">1 Month+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Interests & Preferences
            </Label>
            <Textarea
              id="interests"
              placeholder="Tell us what you enjoy... (e.g., historical sites, adventure sports, local cuisine, nightlife, nature)"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="min-h-20"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Itinerary
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
