const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const User = require("../models/User")
const Accommodation = require("../models/Accommodation")
const Restaurant = require("../models/Restaurant")
const Destination = require("../models/Destination")
const SOSAlert = require("../models/SOSAlert")
const Booking = require("../models/Booking")
const Analytics = require("../models/Analytics")

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
  try {
    const [
      totalUsers,
      totalAccommodations,
      totalRestaurants,
      totalDestinations,
      totalBookings,
      activeSOSAlerts,
      recentUsers,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Accommodation.countDocuments(),
      Restaurant.countDocuments(),
      Destination.countDocuments(),
      Booking.countDocuments(),
      SOSAlert.countDocuments({ status: "active" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt"),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").populate("accommodation", "name"),
    ])

    // Get user growth data for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get booking revenue data
    const bookingRevenue = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalAccommodations,
          totalRestaurants,
          totalDestinations,
          totalBookings,
          activeSOSAlerts,
        },
        charts: {
          userGrowth,
          bookingRevenue,
        },
        recent: {
          users: recentUsers,
          bookings: recentBookings,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const status = req.query.status

    const query = {}

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    if (status) {
      query.isActive = status === "active"
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/admin/users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user active status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/users/:id/toggle-status", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/admin/accommodations:
 *   post:
 *     summary: Add new accommodation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.post("/accommodations", protect, authorize("admin"), async (req, res) => {
  try {
    const accommodation = await Accommodation.create({
      ...req.body,
      addedBy: req.user.id,
    })

    res.status(201).json({
      success: true,
      data: accommodation,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/admin/accommodations/{id}:
 *   put:
 *     summary: Update accommodation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.put("/accommodations/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true },
    )

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      })
    }

    res.json({
      success: true,
      data: accommodation,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/admin/sos-alerts:
 *   get:
 *     summary: Get all SOS alerts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/sos-alerts", protect, authorize("admin"), async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const status = req.query.status
    const severity = req.query.severity

    const query = {}
    if (status) query.status = status
    if (severity) query.severity = severity

    const alerts = await SOSAlert.find(query)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await SOSAlert.countDocuments(query)

    res.json({
      success: true,
      data: alerts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/bookings", protect, authorize("admin"), async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const status = req.query.status

    const query = {}
    if (status) query.status = status

    const bookings = await Booking.find(query)
      .populate("user", "name email")
      .populate("accommodation", "name location")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Booking.countDocuments(query)

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

module.exports = router
