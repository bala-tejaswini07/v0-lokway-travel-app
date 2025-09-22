const express = require("express")
const { validationResult } = require("express-validator")
const Booking = require("../models/Booking")
const Accommodation = require("../models/Accommodation")
const { auth } = require("../middleware/auth")
const { commonValidation } = require("../utils/validators")
const { sendEmail } = require("../utils/helpers")

const router = express.Router()

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accommodationId
 *               - roomId
 *               - checkIn
 *               - checkOut
 *               - guests
 *             properties:
 *               accommodationId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: object
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/", auth, async (req, res) => {
  try {
    const { accommodationId, roomId, checkIn, checkOut, guests, guestDetails, specialRequests, paymentMethod } =
      req.body

    // Validate required fields
    if (!accommodationId || !roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking information",
      })
    }

    // Get accommodation and verify availability
    const accommodation = await Accommodation.findById(accommodationId)
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const availableRooms = accommodation.checkAvailability(checkInDate, checkOutDate, guests.total)

    const selectedRoom = availableRooms.find((room) => room._id.toString() === roomId)
    if (!selectedRoom) {
      return res.status(400).json({
        success: false,
        message: "Selected room is not available for the specified dates",
      })
    }

    // Calculate pricing
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    const basePrice = selectedRoom.price || accommodation.pricing.basePrice
    const subtotal = basePrice * nights

    // Calculate fees and taxes
    const fees = []
    const taxes = []

    // Add cleaning fee if applicable
    const cleaningFee = accommodation.pricing.extraCharges?.find((charge) => charge.name === "cleaning")
    if (cleaningFee) {
      fees.push({
        name: "Cleaning Fee",
        amount: cleaningFee.amount,
        type: "cleaning",
      })
    }

    // Add service fee (example: 10% of subtotal)
    const serviceFee = Math.round(subtotal * 0.1 * 100) / 100
    fees.push({
      name: "Service Fee",
      amount: serviceFee,
      type: "service",
    })

    // Add tax (example: 8% of subtotal)
    const taxAmount = Math.round(subtotal * 0.08 * 100) / 100
    taxes.push({
      name: "Tax",
      rate: 8,
      amount: taxAmount,
    })

    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
    const totalTaxes = taxes.reduce((sum, tax) => sum + tax.amount, 0)
    const total = subtotal + totalFees + totalTaxes

    // Create booking
    const booking = new Booking({
      guest: req.user.id,
      accommodation: accommodationId,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests,
      guestDetails,
      pricing: {
        basePrice,
        nights,
        subtotal,
        fees,
        taxes,
        total,
        currency: accommodation.pricing.currency,
      },
      payment: {
        method: paymentMethod || "credit_card",
        status: "pending",
      },
      specialRequests: specialRequests || [],
      status: accommodation.bookingSettings.instantBook ? "confirmed" : "pending",
    })

    await booking.save()

    // Update room availability
    const dateRange = accommodation.getDateRange(checkInDate, checkOutDate)
    const room = accommodation.rooms.id(roomId)

    dateRange.forEach((date) => {
      const existingAvailability = room.availability.find((avail) => avail.date.toDateString() === date.toDateString())

      if (existingAvailability) {
        existingAvailability.available = false
      } else {
        room.availability.push({
          date,
          available: false,
        })
      }
    })

    await accommodation.save()

    // Send confirmation emails
    const guestEmail = guestDetails?.primaryGuest?.email || req.user.email
    await sendEmail(
      guestEmail,
      "Booking Confirmation - Travel App",
      `
        <h2>Booking Confirmation</h2>
        <p>Your booking has been ${booking.status}!</p>
        <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
        <p><strong>Accommodation:</strong> ${accommodation.name}</p>
        <p><strong>Check-in:</strong> ${checkInDate.toDateString()}</p>
        <p><strong>Check-out:</strong> ${checkOutDate.toDateString()}</p>
        <p><strong>Total:</strong> ${accommodation.pricing.currency} ${total}</p>
      `,
    )

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: {
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        total: booking.pricing.total,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      },
    })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error creating booking",
    })
  }
})

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [upcoming, past, current]
 *     responses:
 *       200:
 *         description: User's bookings
 */
router.get("/", auth, commonValidation.pagination, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query

    const filter = { guest: req.user.id }

    if (status) filter.status = status

    if (type) {
      const now = new Date()
      switch (type) {
        case "upcoming":
          filter.checkIn = { $gt: now }
          break
        case "current":
          filter.checkIn = { $lte: now }
          filter.checkOut = { $gt: now }
          break
        case "past":
          filter.checkOut = { $lt: now }
          break
      }
    }

    const bookings = await Booking.find(filter)
      .populate("accommodation", "name type location images primaryImage")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Booking.countDocuments(filter)

    res.json({
      success: true,
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({
      success: false,
      message: "Server error retrieving bookings",
    })
  }
})

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking details
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get("/:id", auth, commonValidation.mongoId, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      guest: req.user.id,
    })
      .populate("accommodation", "name type location contact policies images")
      .populate("guest", "name email phone avatar")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error retrieving booking",
    })
  }
})

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 */
router.post("/:id/cancel", auth, commonValidation.mongoId, async (req, res) => {
  try {
    const { reason } = req.body

    const booking = await Booking.findOne({
      _id: req.params.id,
      guest: req.user.id,
    }).populate("accommodation")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled at this time",
      })
    }

    // Calculate refund based on cancellation policy
    let refundAmount = 0
    const cancellationPolicy = booking.accommodation.policies.cancellation
    const hoursUntilCheckIn = (booking.checkIn - new Date()) / (1000 * 60 * 60)

    if (cancellationPolicy.type === "flexible") {
      refundAmount = hoursUntilCheckIn > 24 ? booking.pricing.total : booking.pricing.total * 0.5
    } else if (cancellationPolicy.type === "moderate") {
      refundAmount = hoursUntilCheckIn > 120 ? booking.pricing.total : 0
    } else if (cancellationPolicy.type === "strict") {
      refundAmount = hoursUntilCheckIn > 168 ? booking.pricing.total * 0.5 : 0
    }

    // Update booking
    booking.status = "cancelled"
    booking.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: "guest",
      reason: reason || "No reason provided",
      refundAmount,
      refundStatus: "pending",
    }

    await booking.save()

    // Free up room availability
    const accommodation = booking.accommodation
    const room = accommodation.rooms.id(booking.room)
    const dateRange = accommodation.getDateRange(booking.checkIn, booking.checkOut)

    dateRange.forEach((date) => {
      const availability = room.availability.find((avail) => avail.date.toDateString() === date.toDateString())
      if (availability) {
        availability.available = true
      }
    })

    await accommodation.save()

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      refundAmount,
      refundStatus: "pending",
    })
  } catch (error) {
    console.error("Cancel booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error cancelling booking",
    })
  }
})

module.exports = router
