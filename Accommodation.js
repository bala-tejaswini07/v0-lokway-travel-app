const mongoose = require("mongoose")

const accommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Accommodation name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      required: [true, "Accommodation type is required"],
      enum: ["hotel", "homestay", "apartment", "hostel", "resort", "guesthouse", "villa", "cabin"],
    },

    // Location information
    location: {
      address: {
        street: String,
        city: { type: String, required: true },
        state: String,
        country: { type: String, required: true },
        zipCode: String,
        fullAddress: String,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
          index: "2dsphere",
        },
      },
      neighborhood: String,
      landmarks: [String],
    },

    // Contact information
    contact: {
      phone: String,
      email: String,
      website: String,
      socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
      },
    },

    // Pricing information
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      currency: {
        type: String,
        default: "USD",
      },
      priceUnit: {
        type: String,
        enum: ["per_night", "per_week", "per_month"],
        default: "per_night",
      },
      seasonalPricing: [
        {
          season: String,
          startDate: Date,
          endDate: Date,
          priceMultiplier: {
            type: Number,
            default: 1.0,
          },
        },
      ],
      extraCharges: [
        {
          name: String,
          amount: Number,
          type: {
            type: String,
            enum: ["fixed", "percentage", "per_person", "per_night"],
          },
          mandatory: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },

    // Room/unit information
    rooms: [
      {
        name: String,
        type: {
          type: String,
          enum: ["single", "double", "twin", "suite", "dormitory", "entire_place"],
        },
        capacity: {
          adults: { type: Number, default: 2 },
          children: { type: Number, default: 0 },
          total: { type: Number, default: 2 },
        },
        beds: [
          {
            type: {
              type: String,
              enum: ["single", "double", "queen", "king", "bunk", "sofa_bed"],
            },
            count: { type: Number, default: 1 },
          },
        ],
        size: Number, // in square meters
        price: Number,
        amenities: [String],
        images: [String],
        availability: [
          {
            date: Date,
            available: { type: Boolean, default: true },
            price: Number,
            minStay: { type: Number, default: 1 },
          },
        ],
      },
    ],

    // Amenities and features
    amenities: {
      basic: [
        {
          type: String,
          enum: ["wifi", "parking", "breakfast", "air_conditioning", "heating", "kitchen", "laundry", "tv", "bathroom"],
        },
      ],
      comfort: [
        {
          type: String,
          enum: ["pool", "gym", "spa", "restaurant", "bar", "room_service", "concierge", "business_center"],
        },
      ],
      accessibility: [
        {
          type: String,
          enum: ["wheelchair_accessible", "elevator", "braille", "hearing_loop", "accessible_bathroom"],
        },
      ],
      family: [
        {
          type: String,
          enum: ["crib", "high_chair", "playground", "babysitting", "family_rooms", "kids_club"],
        },
      ],
      pet: [
        {
          type: String,
          enum: ["pet_friendly", "pet_sitting", "pet_park", "pet_fee"],
        },
      ],
    },

    // Policies
    policies: {
      checkIn: {
        from: String, // e.g., "15:00"
        to: String, // e.g., "22:00"
        instructions: String,
      },
      checkOut: {
        from: String,
        to: String,
        instructions: String,
      },
      cancellation: {
        type: {
          type: String,
          enum: ["flexible", "moderate", "strict", "super_strict"],
          default: "moderate",
        },
        description: String,
        deadlines: [
          {
            days: Number,
            refundPercentage: Number,
          },
        ],
      },
      payment: {
        acceptedMethods: [
          {
            type: String,
            enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "cash", "crypto"],
          },
        ],
        deposit: {
          required: { type: Boolean, default: false },
          amount: Number,
          type: {
            type: String,
            enum: ["fixed", "percentage"],
          },
        },
      },
      house_rules: [String],
    },

    // Images and media
    images: [
      {
        url: { type: String, required: true },
        caption: String,
        type: {
          type: String,
          enum: ["exterior", "interior", "room", "bathroom", "amenity", "view", "food"],
          default: "interior",
        },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],

    // Reviews and ratings
    reviews: {
      average: {
        overall: { type: Number, default: 0, min: 0, max: 5 },
        cleanliness: { type: Number, default: 0, min: 0, max: 5 },
        comfort: { type: Number, default: 0, min: 0, max: 5 },
        location: { type: Number, default: 0, min: 0, max: 5 },
        service: { type: Number, default: 0, min: 0, max: 5 },
        value: { type: Number, default: 0, min: 0, max: 5 },
      },
      count: { type: Number, default: 0 },
      distribution: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 },
      },
    },

    // Owner/manager information
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPartner: {
      type: Boolean,
      default: false,
    },
    partnerLevel: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },

    // Status and verification
    status: {
      type: String,
      enum: ["draft", "pending", "active", "inactive", "suspended"],
      default: "draft",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: Date,

    // Booking settings
    bookingSettings: {
      instantBook: { type: Boolean, default: false },
      minStay: { type: Number, default: 1 },
      maxStay: { type: Number, default: 365 },
      advanceBooking: { type: Number, default: 365 }, // days in advance
      preparationTime: { type: Number, default: 0 }, // hours needed between bookings
      weekendPricing: {
        enabled: { type: Boolean, default: false },
        multiplier: { type: Number, default: 1.2 },
      },
    },

    // Analytics and performance
    analytics: {
      views: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      occupancyRate: { type: Number, default: 0 },
      averageStay: { type: Number, default: 0 },
      repeatGuests: { type: Number, default: 0 },
    },

    // SEO and marketing
    seo: {
      slug: {
        type: String,
        unique: true,
        sparse: true,
      },
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    // Special offers and promotions
    promotions: [
      {
        name: String,
        description: String,
        type: {
          type: String,
          enum: ["discount", "free_night", "upgrade", "early_bird", "last_minute"],
        },
        value: Number, // percentage or fixed amount
        startDate: Date,
        endDate: Date,
        conditions: [String],
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for efficient queries
accommodationSchema.index({ "location.coordinates": "2dsphere" })
accommodationSchema.index({ type: 1, status: 1 })
accommodationSchema.index({ "pricing.basePrice": 1 })
accommodationSchema.index({ "reviews.average.overall": -1 })
accommodationSchema.index({ owner: 1 })
accommodationSchema.index({ isPartner: 1, partnerLevel: 1 })
accommodationSchema.index({ "location.address.city": 1, "location.address.country": 1 })

// Virtual for primary image
accommodationSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary)
  return primary ? primary.url : this.images.length > 0 ? this.images[0].url : null
})

// Virtual for availability status
accommodationSchema.virtual("isAvailable").get(function () {
  return (
    this.status === "active" &&
    this.rooms.some((room) => room.availability.some((avail) => avail.available && avail.date >= new Date()))
  )
})

// Method to calculate average price
accommodationSchema.methods.getAveragePrice = function () {
  if (this.rooms.length === 0) return this.pricing.basePrice

  const totalPrice = this.rooms.reduce((sum, room) => sum + (room.price || this.pricing.basePrice), 0)
  return totalPrice / this.rooms.length
}

// Method to check availability for date range
accommodationSchema.methods.checkAvailability = function (checkIn, checkOut, guests = 1) {
  const availableRooms = this.rooms.filter((room) => {
    if (room.capacity.total < guests) return false

    // Check if all dates in range are available
    const dateRange = this.getDateRange(checkIn, checkOut)
    return dateRange.every((date) => {
      const availability = room.availability.find((avail) => avail.date.toDateString() === date.toDateString())
      return availability ? availability.available : true
    })
  })

  return availableRooms
}

// Helper method to get date range
accommodationSchema.methods.getDateRange = (startDate, endDate) => {
  const dates = []
  const currentDate = new Date(startDate)

  while (currentDate < endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

module.exports = mongoose.model("Accommodation", accommodationSchema)
