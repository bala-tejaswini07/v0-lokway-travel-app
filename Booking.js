const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    // Booking reference
    bookingNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Parties involved
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Booking dates
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    nights: {
      type: Number,
      required: true,
    },

    // Guest information
    guests: {
      adults: { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true },
    },

    guestDetails: {
      primaryGuest: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        dateOfBirth: Date,
        nationality: String,
        idType: {
          type: String,
          enum: ["passport", "drivers_license", "national_id"],
        },
        idNumber: String,
      },
      additionalGuests: [
        {
          firstName: String,
          lastName: String,
          dateOfBirth: Date,
          relationship: String,
        },
      ],
    },

    // Pricing breakdown
    pricing: {
      basePrice: { type: Number, required: true },
      nights: { type: Number, required: true },
      subtotal: { type: Number, required: true },

      fees: [
        {
          name: String,
          amount: Number,
          type: {
            type: String,
            enum: ["cleaning", "service", "tax", "deposit", "extra_guest", "pet"],
          },
        },
      ],

      discounts: [
        {
          name: String,
          amount: Number,
          type: {
            type: String,
            enum: ["early_bird", "last_minute", "weekly", "monthly", "loyalty", "promo_code"],
          },
          code: String,
        },
      ],

      taxes: [
        {
          name: String,
          rate: Number,
          amount: Number,
        },
      ],

      total: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },

    // Payment information
    payment: {
      method: {
        type: String,
        enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "cash"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "authorized", "captured", "failed", "refunded", "partially_refunded"],
        default: "pending",
      },
      transactions: [
        {
          id: String,
          type: {
            type: String,
            enum: ["authorization", "capture", "refund", "chargeback"],
          },
          amount: Number,
          status: String,
          processedAt: Date,
          gateway: String,
          gatewayTransactionId: String,
        },
      ],
      depositPaid: { type: Number, default: 0 },
      balanceDue: { type: Number, default: 0 },
      refundAmount: { type: Number, default: 0 },
    },

    // Booking status
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"],
      default: "pending",
    },

    // Special requests and notes
    specialRequests: [String],
    guestNotes: String,
    hostNotes: String,
    internalNotes: String,

    // Check-in/out details
    checkInDetails: {
      actualTime: Date,
      method: {
        type: String,
        enum: ["self", "host", "keybox", "concierge"],
      },
      instructions: String,
      keyLocation: String,
    },

    checkOutDetails: {
      actualTime: Date,
      condition: {
        type: String,
        enum: ["excellent", "good", "fair", "poor"],
      },
      damages: [String],
      notes: String,
    },

    // Cancellation information
    cancellation: {
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["guest", "host", "admin"],
      },
      reason: String,
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "failed"],
      },
      refundProcessedAt: Date,
    },

    // Communication
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Review information
    review: {
      guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
      host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    },

    // Booking source
    source: {
      type: String,
      enum: ["direct", "mobile_app", "partner", "api"],
      default: "direct",
    },

    // Metadata
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
      utm: {
        source: String,
        medium: String,
        campaign: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes
bookingSchema.index({ guest: 1, status: 1 })
bookingSchema.index({ accommodation: 1, checkIn: 1, checkOut: 1 })
bookingSchema.index({ bookingNumber: 1 })
bookingSchema.index({ checkIn: 1, checkOut: 1 })
bookingSchema.index({ status: 1, createdAt: -1 })

// Virtual for booking duration
bookingSchema.virtual("duration").get(function () {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24))
})

// Pre-save middleware to generate booking number
bookingSchema.pre("save", async function (next) {
  if (!this.bookingNumber) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    this.bookingNumber = `BK${timestamp}${random}`.toUpperCase()
  }

  // Calculate nights
  if (this.checkIn && this.checkOut) {
    this.nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24))
  }

  next()
})

// Method to calculate total guests
bookingSchema.methods.getTotalGuests = function () {
  return this.guests.adults + this.guests.children + this.guests.infants
}

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function () {
  const now = new Date()
  const checkInDate = new Date(this.checkIn)
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60)

  return this.status === "confirmed" && hoursUntilCheckIn > 24
}

module.exports = mongoose.model("Booking", bookingSchema)
