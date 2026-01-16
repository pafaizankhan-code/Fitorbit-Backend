const mongoose = require("mongoose");

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationInDays: { type: Number, required: true },
  maxMembers: { type: Number, required: true },
  features: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // SUPER_ADMIN
}, { timestamps: true });

module.exports = mongoose.model("MembershipPlan", membershipPlanSchema);
