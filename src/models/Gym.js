const mongoose = require("mongoose");

const gymSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { 
      type: String, 
      required: [false, "Gym name is required"],
      trim: false
    },
    gymType: { 
      type: String, 
      enum: ['Standard', 'Premium', 'Boutique', 'CrossFit', 'Wellness', 'Sports'],
      default: 'Standard'
    },
    description: { 
      type: String, 
      trim: false
    },
    
    // Owner Information
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ownerName: { type: String },
    ownerEmail: { type: String },
    ownerPhone: { type: String },
    
    // Location Details
    address: { 
      type: String, 
      required: [false, "Address is required"] 
    },
    city: { 
      type: String, 
      required: [false, "City is required"] 
    },
    state: { 
      type: String, 
      required: [false, "State is required"] 
    },
    country: { 
      type: String, 
      default: "India" 
    },
    pincode: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    
    // Contact Information
    email: { 
      type: String,
      lowercase: false,
      trim: false
    },
    phone: { type: String },
    website: { type: String },
    
    // Operational Details
    openingTime: { 
      type: String,
      default: "06:00"
    },
    closingTime: { 
      type: String,
      default: "22:00"
    },
    workingDays: [{ 
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    is24x7: { 
      type: Boolean, 
      default: false 
    },
    
    // Facilities & Equipment
    facilities: [{ 
      type: String, 
      trim: false 
    }],
    equipmentType: { 
      type: String, 
      enum: ['Basic', 'Standard', 'Advanced', 'Premium', 'Professional'],
      default: 'Standard'
    },
    gymSize: { type: String }, // in sq ft
    totalEquipment: { type: Number },
    specialFeatures: [{ type: String }],
    
    // Amenities
    hasParking: { type: Boolean, default: false },
    hasShower: { type: Boolean, default: false },
    hasCafe: { type: Boolean, default: false },
    hasWiFi: { type: Boolean, default: false },
    
    // Business Details
    businessRegistration: { type: String },
    taxId: { type: String }, // GST number
    targetAudience: [{ type: String }],
    
    // Subscription Details
    subscriptionPlan: { type: String },
    billingCycle: { 
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual', 'biennial'],
      default: 'monthly'
    },
    subscriptionStart: { type: Date },
    subscriptionEnd: { type: Date },
    paymentMethod: { 
      type: String,
      enum: ['Bank Transfer', 'Credit Card', 'UPI', 'Cash', 'Check'],
      default: 'Bank Transfer'
    },
    paymentStatus: { 
      type: String,
      enum: ['paid', 'pending', 'overdue', 'cancelled'],
      default: 'pending'
    },
    renewalDate: { type: Date },
    
    // Statistics (can be calculated from members data)
    totalMembers: { type: Number, default: 0 },
    activeMembers: { type: Number, default: 0 },
    totalStaff: { type: Number, default: 0 },
    monthlyRevenue: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    
    // Status & Verification
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'suspended', 'pending'],
      default: 'active'
    },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    
    // Additional Information
    joinDate: { 
      type: Date, 
      default: Date.now 
    },
    lastRenewal: { type: Date },
    registrationProof: { type: String }, // URL to document
    logo: { type: String }, // URL to logo
    images: [{ type: String }], // Array of image URLs
    
    // Meta
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { 
    timestamps: false 
  }
);

// Indexes for better query performance
gymSchema.index({ name: 'text', city: 'text', state: 'text' });
gymSchema.index({ status: 1, isActive: 1, isVerified: 1 });
gymSchema.index({ ownerId: 1 });
gymSchema.index({ city: 1, state: 1 });

// Virtual for full address
gymSchema.virtual('fullAddress').get(function() {
  const parts = [
    this.address,
    this.city,
    this.state,
    this.pincode,
    this.country
  ].filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
});

// Virtual for operational hours
gymSchema.virtual('operationalHours').get(function() {
  if (this.is24x7) {
    return '24/7';
  }
  return `${this.openingTime || '06:00'} - ${this.closingTime || '22:00'}`;
});

module.exports = mongoose.model("Gym", gymSchema);