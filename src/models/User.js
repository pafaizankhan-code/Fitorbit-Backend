const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["SUPER_ADMIN","GYM_OWNER","STAFF"], default: "GYM_OWNER" },
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ✅ Async hook without next()
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
