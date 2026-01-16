const mongoose = require("mongoose");

const gymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: { type: Boolean, default: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    phone: { type: String },
    email: { type: String },
    openingTime: { type: String },
    closingTime: { type: String },
    subscriptionPlan: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gym", gymSchema);
