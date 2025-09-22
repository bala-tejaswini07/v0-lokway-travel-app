const Analytics = require("../models/Analytics")

// Middleware to automatically track certain events
const trackEvent = (eventType, getMetadata = () => ({})) => {
  return async (req, res, next) => {
    try {
      // Store original res.json to intercept successful responses
      const originalJson = res.json

      res.json = function (data) {
        // Only track if response is successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Track event asynchronously (don't wait for it)
          setImmediate(async () => {
            try {
              const analyticsData = {
                eventType,
                userId: req.user?.id,
                sessionId: req.headers["x-session-id"] || `session_${Date.now()}`,
                metadata: getMetadata(req, res, data),
                location: req.body?.location || req.query?.location,
                deviceInfo: {
                  userAgent: req.headers["user-agent"],
                  platform: req.headers["x-platform"],
                  version: req.headers["x-app-version"],
                },
                timestamp: new Date(),
              }

              await Analytics.create(analyticsData)
            } catch (error) {
              console.error("Analytics tracking error:", error)
            }
          })
        }

        // Call original json method
        return originalJson.call(this, data)
      }

      next()
    } catch (error) {
      console.error("Analytics middleware error:", error)
      next() // Continue even if analytics fails
    }
  }
}

// Specific tracking middleware for common events
const trackRouteSearch = trackEvent("route_search", (req) => ({
  origin: req.body.origin,
  destination: req.body.destination,
  transportMode: req.body.transportMode,
  routeType: req.body.routeType,
}))

const trackAccommodationSearch = trackEvent("accommodation_search", (req) => ({
  location: req.query.location,
  checkIn: req.query.checkIn,
  checkOut: req.query.checkOut,
  guests: req.query.guests,
  type: req.query.type,
}))

const trackBooking = trackEvent("accommodation_book", (req, res, data) => ({
  accommodationId: req.body.accommodationId,
  checkIn: req.body.checkIn,
  checkOut: req.body.checkOut,
  totalAmount: req.body.totalAmount,
  bookingId: data?.data?._id,
}))

const trackFoodSearch = trackEvent("food_search", (req) => ({
  location: req.query.location,
  cuisine: req.query.cuisine,
  priceRange: req.query.priceRange,
  radius: req.query.radius,
}))

const trackDestinationView = trackEvent("destination_view", (req) => ({
  destinationId: req.params.id,
  category: req.query.category,
}))

module.exports = {
  trackEvent,
  trackRouteSearch,
  trackAccommodationSearch,
  trackBooking,
  trackFoodSearch,
  trackDestinationView,
}
