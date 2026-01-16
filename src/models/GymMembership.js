const mongoose = require("mongoose");

const gymMembershipSchema = new mongoose.Schema({
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan", required: true },
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // SUPER_ADMIN who assigned
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  maxMembers: { type: Number }, // from plan
  currentMembers: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("GymMembership", gymMembershipSchema);
