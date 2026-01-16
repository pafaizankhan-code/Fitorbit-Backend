const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const roles = require("../constants/roles");

router.post("/login", authController.login);

// SUPER_ADMIN → Create GymOwner
router.post(
  "/create-gym-owner",
  protect,                  // ✅ now middleware works
  roleMiddleware(roles.SUPER_ADMIN),
  authController.createGymOwner
);

module.exports = router;
