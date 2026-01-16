const MembershipPlan = require("../models/MembershipPlan");

// Create Membership Plan
exports.createPlan = async (req, res) => {
  try {
    const { name, price, durationInDays, maxMembers, features } = req.body;

    const plan = await MembershipPlan.create({
      name,
      price,
      durationInDays,
      maxMembers,
      features,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Membership plan created", plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find();
    res.json({ success: true, total: plans.length, plans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Plan
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await MembershipPlan.findByIdAndUpdate(planId, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan updated", plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Plan
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    await MembershipPlan.findByIdAndDelete(planId);
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
