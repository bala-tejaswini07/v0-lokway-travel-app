const express = require("express")
const { validationResult } = require("express-validator")
const Accommodation = require("../models/Accommodation")
const Booking = require("../models/Booking")
const Review = require("../models/Review")
const { auth, authorize, optionalAuth } = require("../middleware/auth")
const { accommodationValidation, commonValidation } = require("../utils/validators")

const router = express.Router()

/**
 * @swagger
 * /api/accommodations:
 *   post:
 *     summary: Create new accommodation
 *     tags: [Accommodations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Accommodation'
 *     responses:
 *       201:
 *         description: Accommodation created successfully
 */
router.post("/", auth, accommodationValidation.create, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const accommodationData = {
      ...req.body,
      owner: req.user.id,
    }

    // Generate SEO slug
    if (!accommodationData.seo?.slug) {
      const baseSlug = accommodationData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      let slug = baseSlug
      let counter = 1

      while (await Accommodation.findOne({ "seo.slug": slug })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      accommodationData.seo = { ...accommodationData.seo, slug }
    }

    const accommodation = new Accommodation(accommodationData)
    await accommodation.save()

    res.status(201).json({
      success: true,
      message: "Accommodation created successfully",
      accommodation: {
        id: accommodation._id,
        name: accommodation.name,
        type: accommodation.type,
        status: accommodation.status,
        slug: accommodation.seo.slug,
      },
    })
  } catch (error) {
    console.error("Create accommodation error:", error)
    res.status(500).json({
      success: false,
      message: "Server error creating accommodation",
    })
  }
})

/**
 * @swagger
 * /api/accommodations:
 *   get:
 *     summary: Search accommodations
 *     tags: [Accommodations]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: checkIn
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: checkOut
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: guests
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Accommodations found
 */
router.get("/", optionalAuth, commonValidation.pagination, async (req, res) => {
  try {
    const {
      city,
      country,
      type,
      checkIn,
      checkOut,
      guests = 1,
      minPrice,
      maxPrice,
      amenities,
      rating,
      lat,
      lng,
      radius = 10,
      sortBy = "relevance",
      page = 1,
      limit = 20,
    } = req.query

    // Build search filter
    const filter = { status: "active" }

    if (city) filter["location.address.city"] = new RegExp(city, "i")
    if (country) filter["location.address.country"] = new RegExp(country, "i")
    if (type) filter.type = type
    if (minPrice || maxPrice) {
      filter["pricing.basePrice"] = {}
      if (minPrice) filter["pricing.basePrice"].$gte = Number(minPrice)
      if (maxPrice) filter["pricing.basePrice"].$lte = Number(maxPrice)
    }
    if (rating) filter["reviews.average.overall"] = { $gte: Number(rating) }
    if (amenities) {
      const amenityList = amenities.split(",")
      filter.$or = [
        { "amenities.basic": { $in: amenityList } },
        { "amenities.comfort": { $in: amenityList } },
        { "amenities.accessibility": { $in: amenityList } },
      ]
    }

    // Location-based search
    if (lat && lng) {
      filter["location.coordinates"] = {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius) * 1000, // Convert km to meters
        },
      }
    }

    // Build sort criteria
    let sort = {}
    switch (sortBy) {
      case "price_low":
        sort = { "pricing.basePrice": 1 }
        break
      case "price_high":
        sort = { "pricing.basePrice": -1 }
        break
      case "rating":
        sort = { "reviews.average.overall": -1 }
        break
      case "newest":
        sort = { createdAt: -1 }
        break
      default:
        sort = { "reviews.average.overall": -1, "analytics.views": -1 }
    }

    const accommodations = await Accommodation.find(filter)
      .populate("owner", "name avatar isVerified")
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select("name type location pricing amenities images reviews status isPartner")

    // Filter by availability if dates provided
    let availableAccommodations = accommodations
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)

      availableAccommodations = accommodations.filter((accommodation) => {
        const available = accommodation.checkAvailability(checkInDate, checkOutDate, Number(guests))
        return available.length > 0
      })
    }

    const total = await Accommodation.countDocuments(filter)

    res.json({
      success: true,
      accommodations: availableAccommodations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      filters: {
        city,
        country,
        type,
        checkIn,
        checkOut,
        guests: Number(guests),
        minPrice,
        maxPrice,
        sortBy,
      },
    })
  } catch (error) {
    console.error("Search accommodations error:", error)
    res.status(500).json({
      success: false,
      message: "Server error searching accommodations",
    })
  }
})

/**
 * @swagger
 * /api/accommodations/{id}:
 *   get:
 *     summary: Get accommodation details
 *     tags: [Accommodations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accommodation details
 *       404:
 *         description: Accommodation not found
 */
router.get("/:id", optionalAuth, commonValidation.mongoId, async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({
      $or: [{ _id: req.params.id }, { "seo.slug": req.params.id }],
      status: "active",
    }).populate("owner", "name avatar isVerified joinedAt")

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      })
    }

    // Increment view count
    accommodation.analytics.views += 1
    await accommodation.save()

    // Get recent reviews
    const reviews = await Review.find({
      accommodation: accommodation._id,
      status: "published",
      type: "guest_to_host",
    })
      .populate("reviewer", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({
      success: true,
      accommodation,
      reviews,
    })
  } catch (error) {
    console.error("Get accommodation error:", error)
    res.status(500).json({
      success: false,
      message: "Server error retrieving accommodation",
    })
  }
})

/**
 * @swagger
 * /api/accommodations/{id}/availability:
 *   get:
 *     summary: Check accommodation availability
 *     tags: [Accommodations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: checkIn
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: checkOut
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: guests
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Availability information
 */
router.get("/:id/availability", commonValidation.mongoId, async (req, res) => {
  try {
    const { checkIn, checkOut, guests = 1 } = req.query

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required",
      })
    }

    const accommodation = await Accommodation.findById(req.params.id)
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const availableRooms = accommodation.checkAvailability(checkInDate, checkOutDate, Number(guests))

    // Calculate pricing for the stay
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    const pricing = availableRooms.map((room) => ({
      roomId: room._id,
      roomName: room.name,
      basePrice: room.price || accommodation.pricing.basePrice,
      totalPrice: (room.price || accommodation.pricing.basePrice) * nights,
      nights,
      capacity: room.capacity,
    }))

    res.json({
      success: true,
      available: availableRooms.length > 0,
      rooms: availableRooms,
      pricing,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: Number(guests),
    })
  } catch (error) {
    console.error("Check availability error:", error)
    res.status(500).json({
      success: false,
      message: "Server error checking availability",
    })
  }
})

module.exports = router
