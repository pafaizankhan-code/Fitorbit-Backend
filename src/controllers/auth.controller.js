const User = require("../models/User");
const Gym = require("../models/Gym");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const roles = require("../constants/roles");
const MembershipPlan = require("../models/MembershipPlan");
const GymMembership = require("../models/GymMembership");


/**
 * LOGIN (ALL ROLES)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isActive) return res.status(403).json({ message: "User is deactivated" });

    // 2️⃣ Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Fetch Gym + Membership + Plan
    let gymDetails = null;
    if (user.gymId) {
      gymDetails = await Gym.findById(user.gymId)
        .populate("ownerId", "name email role") // Gym owner info
        .lean();

      if (gymDetails) {
        // Fetch membership for this gym
        const membership = await GymMembership.findOne({ gymId: gymDetails._id })
          .populate("planId") // populate plan details
          .lean();

        gymDetails.membership = membership || null;
      }
    }

    // 5️⃣ Response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gymId: user.gymId,
        gym: gymDetails
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


//  * SUPER_ADMIN → CREATE GYM OWNER
//  */
exports.createGymOwner = async (req, res) => {
  try {
    const { name, email, password, gymName, membershipPlanId } = req.body;

    // 1️⃣ Create GymOwner User
    const gymOwner = await User.create({
      name,
      email,
      password, // Assume hashed in pre-save
      role: roles.GYM_OWNER,
      isActive: true
    });

    // 2️⃣ Create Gym
    const gym = await Gym.create({
      name: gymName,
      ownerId: gymOwner._id,
      isActive: true
    });

    // 3️⃣ Link Gym to GymOwner
    gymOwner.gymId = gym._id;
    await gymOwner.save();

    let gymMembership = null;

    // 4️⃣ Assign MembershipPlan if given
    if (membershipPlanId) {
      const plan = await MembershipPlan.findById(membershipPlanId);
      if (!plan) return res.status(400).json({ message: "Invalid membership plan" });

      gymMembership = await GymMembership.create({
        gymId: gym._id,
        planId: plan._id,
        purchasedBy: req.user.id, // SUPER_ADMIN ID
        maxMembers: plan.maxMembers,
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000)
      });
    }

    // 5️⃣ Prepare response with membership included
    const responseGym = {
      ...gym.toObject(),
      membership: gymMembership || null
    };

    res.status(201).json({
      message: "Gym Owner created",
      gymOwner,
      gym: responseGym
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

