const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membership.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const roles = require("../constants/roles");

// SUPER_ADMIN only
router.post("/", authMiddleware, roleMiddleware(roles.SUPER_ADMIN), membershipController.createPlan);
router.get("/", authMiddleware, roleMiddleware(roles.SUPER_ADMIN), membershipController.getAllPlans);
router.put("/:planId", authMiddleware, roleMiddleware(roles.SUPER_ADMIN), membershipController.updatePlan);
router.delete("/:planId", authMiddleware, roleMiddleware(roles.SUPER_ADMIN), membershipController.deletePlan);

module.exports = router;
