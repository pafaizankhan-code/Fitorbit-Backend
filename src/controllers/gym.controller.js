const Gym = require("../models/Gym");
const User = require("../models/User");
const roles = require("../constants/roles");

/**
 * GET ALL GYMS (SUPER_ADMIN)
 */
const GymMembership = require("../models/GymMembership");


exports.getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.find().populate("ownerId").lean();

    const gymsWithMembership = await Promise.all(
      gyms.map(async (gym) => {
        // Find GymMembership by gym._id
        const gymMembership = await GymMembership.findOne({ gymId: gym._id.toString() })
          .populate({
            path: "planId",
            populate: { path: "createdBy", select: "name email" }
          })
          .lean(); // Use lean to avoid Mongoose Document issues

        return {
          ...gym,
          membership: gymMembership || null
        };
      })
    );

    res.json({
      success: true,
      totalGyms: gyms.length,
      gyms: gymsWithMembership
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/**
 * UPDATE GYM (SUPER_ADMIN)
 */
exports.updateGym = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { name, ownerId, isActive, address, city, state, phone, email, openingTime, closingTime, subscriptionPlan } = req.body;

    const gym = await Gym.findById(gymId);
    if (!gym) return res.status(404).json({ message: "Gym not found" });

    // Update basic fields
    if (name) gym.name = name;
    if (address) gym.address = address;
    if (city) gym.city = city;
    if (state) gym.state = state;
    if (phone) gym.phone = phone;
    if (email) gym.email = email;
    if (openingTime) gym.openingTime = openingTime;
    if (closingTime) gym.closingTime = closingTime;
    if (subscriptionPlan) gym.subscriptionPlan = subscriptionPlan;

    // Activate / Deactivate
    if (typeof isActive === "boolean") gym.isActive = isActive;

    // Change owner
    if (ownerId && ownerId !== String(gym.ownerId)) {
      const newOwner = await User.findById(ownerId);
      if (!newOwner || newOwner.role !== roles.GYM_OWNER)
        return res.status(400).json({ message: "Invalid Gym Owner ID" });

      // Reset previous owner gymId
      if (gym.ownerId) {
        await User.findByIdAndUpdate(gym.ownerId, { gymId: null });
      }

      // Assign new owner
      gym.ownerId = ownerId;
      newOwner.gymId = gym._id;
      await newOwner.save();
    }

    await gym.save();

    res.json({ message: "Gym updated successfully", gym });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE GYM (SUPER_ADMIN)
 */
exports.deleteGym = async (req, res) => {
  try {
    const { gymId } = req.params;

    const gym = await Gym.findById(gymId);
    if (!gym) return res.status(404).json({ message: "Gym not found" });

    // Unlink gym from owners
    await User.updateMany({ gymId: gym._id }, { gymId: null });

    // Delete gym
    await Gym.findByIdAndDelete(gymId);

    res.json({ message: "Gym deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
