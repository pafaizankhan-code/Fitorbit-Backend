const Member = require("../models/Member");
const GymMembership = require("../models/GymMembership");

exports.createMember = async (req, res) => {
  try {
    const gymOwner = req.user; // token se aa raha hai
    const { name, email, phone } = req.body;

    // 1️⃣ GymOwner ki gym ki membership lao
    const gymMembership = await GymMembership.findOne({
      gymId: gymOwner.gymId
    });

    if (!gymMembership) {
      return res.status(404).json({ message: "Gym Membership not found" });
    }

    // 2️⃣ Limit check
    if (gymMembership.currentMembers >= gymMembership.maxMembers) {
      return res.status(400).json({ message: "Member limit reached for this plan" });
    }

    // 3️⃣ Member create
    const member = await Member.create({
      gymId: gymOwner.gymId,
      gymMembershipId: gymMembership._id,
      name,
      email,
      phone
    });

    // 4️⃣ Count increment
    gymMembership.currentMembers += 1;
    await gymMembership.save();

    res.status(201).json({
      message: "Member created successfully",
      member,
      membership: {
        maxMembers: gymMembership.maxMembers,
        currentMembers: gymMembership.currentMembers
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// Get Members by Gym
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find({ gymId: req.user.gymId }).populate("gymMembershipId");
    res.json({ success: true, total: members.length, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Member
exports.updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findByIdAndUpdate(memberId, req.body, { new: true });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member updated", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Member
exports.deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Decrement currentMembers
    const gymMembership = await GymMembership.findById(member.gymMembershipId);
    if (gymMembership) {
      gymMembership.currentMembers = Math.max(0, gymMembership.currentMembers - 1);
      await gymMembership.save();
    }

    await Member.findByIdAndDelete(memberId);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
