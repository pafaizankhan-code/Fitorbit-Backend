const mongoose = require("mongoose");

const membershipPlanSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, "Plan name is required"],
    trim: true
  },
  planType: { 
    type: String, 
    required: [true, "Plan type is required"],
    enum: ['Basic', 'Standard', 'Professional', 'Enterprise', 'Startup', 'Corporate'],
    default: 'Basic'
  },
  description: { 
    type: String, 
    required: [true, "Description is required"],
    trim: true
  },
  
  // Pricing & Duration
  price: { 
    type: Number, 
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  originalPrice: { 
    type: Number,
    min: [0, "Original price cannot be negative"]
  },
  billingCycle: { 
    type: String, 
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'semi-annual', 'annual', 'biennial'],
    default: 'monthly'
  },
  duration: { 
    type: Number, 
    required: [true, "Duration is required"],
    min: [1, "Duration must be at least 1"]
  },
  durationUnit: { 
    type: String, 
    required: true,
    enum: ['days', 'months', 'years'],
    default: 'months'
  },
  setupFee: { 
    type: Number, 
    default: 0,
    min: [0, "Setup fee cannot be negative"]
  },
  commission: { 
    type: Number, 
    default: 4,
    min: [0, "Commission cannot be negative"],
    max: [100, "Commission cannot exceed 100%"]
  },
  paymentTerms: { 
    type: String, 
    default: 'Advance',
    enum: ['Advance', 'Net15', 'Net30', 'Net45', 'Net60']
  },
  
  // Features & Limits
  features: [{ 
    type: String, 
    trim: true 
  }],
  maxGyms: { 
    type: Number, 
    required: true,
    min: [1, "Max gyms must be at least 1"]
  },
  maxStaff: { 
    type: Number, 
    required: true,
    min: [1, "Max staff must be at least 1"]
  },
  maxMembers: { 
    type: Number, 
    required: true,
    min: [1, "Max members must be at least 1"]
  },
  storage: { 
    type: String, 
    required: true,
    default: '50 GB'
  },
  supportLevel: { 
    type: String, 
    required: true,
    default: 'Email Only'
  },
  
  // Additional Settings
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isPopular: { 
    type: Boolean, 
    default: false 
  },
  freeTrialDays: { 
    type: Number, 
    default: 0,
    min: [0, "Free trial days cannot be negative"],
    max: [365, "Free trial cannot exceed 365 days"]
  },
  renewalDiscount: { 
    type: Number, 
    default: 0,
    min: [0, "Renewal discount cannot be negative"],
    max: [100, "Renewal discount cannot exceed 100%"]
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Target Audience
  targetAudience: [{ 
    type: String, 
    trim: true 
  }],
  
  // Meta
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  termsAccepted: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Calculate total price (price + setup fee)
membershipPlanSchema.virtual('totalPrice').get(function() {
  return this.price + this.setupFee;
});

// Calculate duration in days
membershipPlanSchema.virtual('durationInDays').get(function() {
  const multipliers = {
    days: 1,
    months: 30,
    years: 365
  };
  return this.duration * multipliers[this.durationUnit];
});

// Add index for better query performance
membershipPlanSchema.index({ status: 1, isFeatured: 1, isPopular: 1 });
membershipPlanSchema.index({ price: 1 });

module.exports = mongoose.model("MembershipPlan", membershipPlanSchema);