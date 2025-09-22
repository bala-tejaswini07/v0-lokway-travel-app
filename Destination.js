const mongoose = require("mongoose")

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [300, "Short description cannot exceed 300 characters"],
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

    // Destination categorization
    category: {
      type: String,
      required: true,
      enum: [
        "historical_site",
        "museum",
        "art_gallery",
        "religious_site",
        "natural_attraction",
        "park",
        "beach",
        "mountain",
        "lake",
        "waterfall",
        "viewpoint",
        "monument",
        "architecture",
        "cultural_center",
        "entertainment",
        "shopping",
        "market",
        "theme_park",
        "zoo",
        "aquarium",
        "sports_venue",
        "festival_ground",
        "neighborhood",
        "street",
        "bridge",
        "building",
        "other",
      ],
    },

    subcategory: [String],

    // Cultural and historical significance
    significance: {
      historical: {
        period: String,
        era: String,
        significance: String,
      },
      cultural: {
        importance: String,
        traditions: [String],
        festivals: [String],
      },
      architectural: {
        style: String,
        architect: String,
        yearBuilt: Number,
        features: [String],
      },
      natural: {
        ecosystem: String,
        wildlife: [String],
        bestSeasons: [String],
        conservation: String,
      },
    },

    // Visitor information
    visitInfo: {
      openingHours: {
        monday: { open: String, close: String, closed: { type: Boolean, default: false } },
        tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
        friday: { open: String, close: String, closed: { type: Boolean, default: false } },
        saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
        sunday: { open: String, close: String, closed: { type: Boolean, default: false } },
      },
      specialHours: [
        {
          date: Date,
          open: String,
          close: String,
          closed: { type: Boolean, default: false },
          reason: String,
        },
      ],
      admissionFee: {
        adult: Number,
        child: Number,
        senior: Number,
        student: Number,
        family: Number,
        currency: { type: String, default: "USD" },
        freeEntry: { type: Boolean, default: false },
        notes: String,
      },
      duration: {
        recommended: Number, // in minutes
        minimum: Number,
        maximum: Number,
      },
      bestTimeToVisit: {
        timeOfDay: [
          {
            type: String,
            enum: ["early_morning", "morning", "afternoon", "evening", "night"],
          },
        ],
        season: [
          {
            type: String,
            enum: ["spring", "summer", "fall", "winter"],
          },
        ],
        months: [String],
        weather: [String],
      },
      crowdLevels: {
        peak: [String], // days/times when it's most crowded
        quiet: [String], // days/times when it's least crowded
        notes: String,
      },
    },

    // Accessibility and facilities
    accessibility: {
      wheelchairAccessible: { type: Boolean, default: false },
      elevatorAccess: { type: Boolean, default: false },
      accessibleParking: { type: Boolean, default: false },
      accessibleRestrooms: { type: Boolean, default: false },
      brailleSignage: { type: Boolean, default: false },
      audioGuides: { type: Boolean, default: false },
      signLanguage: { type: Boolean, default: false },
      notes: String,
    },

    facilities: {
      parking: { available: Boolean, free: Boolean, notes: String },
      restrooms: { available: Boolean, accessible: Boolean },
      giftShop: { available: Boolean, description: String },
      restaurant: { available: Boolean, description: String },
      cafe: { available: Boolean, description: String },
      wifi: { available: Boolean, free: Boolean },
      lockers: { available: Boolean, cost: Number },
      guidedTours: { available: Boolean, languages: [String], cost: Number },
      audioGuides: { available: Boolean, languages: [String], cost: Number },
      photography: { allowed: Boolean, restrictions: String },
    },

    // Transportation
    transportation: {
      publicTransport: [
        {
          type: {
            type: String,
            enum: ["bus", "train", "subway", "tram", "ferry"],
          },
          line: String,
          stop: String,
          walkingDistance: Number, // in meters
          notes: String,
        },
      ],
      parking: {
        available: Boolean,
        free: Boolean,
        cost: Number,
        spaces: Number,
        notes: String,
      },
      walkingDistance: {
        fromCity: Number, // in km
        fromTransport: Number, // in meters
      },
    },

    // Images and media
    images: [
      {
        url: { type: String, required: true },
        caption: String,
        type: {
          type: String,
          enum: ["exterior", "interior", "detail", "panoramic", "historical", "activity", "crowd"],
          default: "exterior",
        },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        photographer: String,
        license: String,
      },
    ],

    videos: [
      {
        url: String,
        title: String,
        description: String,
        duration: Number, // in seconds
        type: {
          type: String,
          enum: ["tour", "documentary", "promotional", "user_generated"],
        },
      },
    ],

    // Reviews and ratings
    reviews: {
      average: {
        overall: { type: Number, default: 0, min: 0, max: 5 },
        historical: { type: Number, default: 0, min: 0, max: 5 },
        beauty: { type: Number, default: 0, min: 0, max: 5 },
        accessibility: { type: Number, default: 0, min: 0, max: 5 },
        value: { type: Number, default: 0, min: 0, max: 5 },
        crowdLevel: { type: Number, default: 0, min: 0, max: 5 }, // 1 = very crowded, 5 = not crowded
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

    // Multilingual support
    translations: [
      {
        language: {
          type: String,
          required: true,
        },
        name: String,
        description: String,
        shortDescription: String,
        highlights: [String],
        tips: [String],
        history: String,
      },
    ],

    // Tags and keywords
    tags: [String],
    keywords: [String],

    // Special designations
    designations: [
      {
        type: String,
        enum: [
          "unesco_world_heritage",
          "national_monument",
          "national_park",
          "protected_area",
          "cultural_heritage",
          "natural_heritage",
          "biosphere_reserve",
          "ramsar_wetland",
          "michelin_recommended",
          "tripadvisor_choice",
          "lonely_planet_top",
        ],
      },
    ],

    // Visitor tips and recommendations
    tips: [
      {
        category: {
          type: String,
          enum: ["general", "photography", "timing", "clothing", "safety", "cultural", "budget"],
        },
        tip: String,
        language: { type: String, default: "en" },
      },
    ],

    // Related destinations
    relatedDestinations: [
      {
        destination: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Destination",
        },
        relationship: {
          type: String,
          enum: ["nearby", "similar", "part_of_tour", "alternative", "complementary"],
        },
        distance: Number, // in km
      },
    ],

    // Events and activities
    activities: [
      {
        name: String,
        description: String,
        type: {
          type: String,
          enum: ["tour", "workshop", "performance", "exhibition", "festival", "ceremony", "sport"],
        },
        duration: Number, // in minutes
        cost: Number,
        languages: [String],
        maxParticipants: Number,
        ageRestriction: String,
        schedule: [
          {
            dayOfWeek: String,
            times: [String],
          },
        ],
        seasonal: Boolean,
        bookingRequired: Boolean,
        bookingUrl: String,
      },
    ],

    // Status and verification
    status: {
      type: String,
      enum: ["active", "inactive", "temporarily_closed", "permanently_closed", "under_construction"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: Date,
    lastUpdated: Date,

    // Analytics
    analytics: {
      views: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      checkins: { type: Number, default: 0 },
      photoUploads: { type: Number, default: 0 },
    },

    // Content management
    curator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sources: [
      {
        name: String,
        url: String,
        type: {
          type: String,
          enum: ["official", "tourism_board", "wikipedia", "travel_guide", "user_generated"],
        },
        lastChecked: Date,
      },
    ],

    // SEO
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for efficient queries
destinationSchema.index({ "location.coordinates": "2dsphere" })
destinationSchema.index({ category: 1, status: 1 })
destinationSchema.index({ "reviews.average.overall": -1 })
destinationSchema.index({ "location.address.city": 1, "location.address.country": 1 })
destinationSchema.index({ tags: 1 })
destinationSchema.index({ designations: 1 })
destinationSchema.index({ "seo.slug": 1 })

// Virtual for primary image
destinationSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary)
  return primary ? primary.url : this.images.length > 0 ? this.images[0].url : null
})

// Virtual for current operating status
destinationSchema.virtual("isOpen").get(function () {
  if (this.status !== "active") return false

  const now = new Date()
  const dayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][now.getDay()]
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

  const todayHours = this.visitInfo.openingHours[dayOfWeek]
  if (!todayHours || todayHours.closed) return false

  return currentTime >= todayHours.open && currentTime <= todayHours.close
})

// Method to get translation for specific language
destinationSchema.methods.getTranslation = function (language) {
  const translation = this.translations.find((t) => t.language === language)
  return translation || null
}

// Method to get localized content
destinationSchema.methods.getLocalizedContent = function (language = "en") {
  const translation = this.getTranslation(language)

  return {
    name: translation?.name || this.name,
    description: translation?.description || this.description,
    shortDescription: translation?.shortDescription || this.shortDescription,
    highlights: translation?.highlights || [],
    tips: translation?.tips || [],
    history: translation?.history || "",
  }
}

// Method to check if destination is suitable for specific interests
destinationSchema.methods.matchesInterests = function (interests) {
  if (!interests || interests.length === 0) return true

  const destinationTags = [...this.tags, this.category, ...this.subcategory]
  return interests.some((interest) => destinationTags.includes(interest))
}

module.exports = mongoose.model("Destination", destinationSchema)
