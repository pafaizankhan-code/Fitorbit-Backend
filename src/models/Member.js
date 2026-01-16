const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
  gymMembershipId: { type: mongoose.Schema.Types.ObjectId, ref: "GymMembership" },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);
