const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const roles = require("../constants/roles");

// GymOwner only
router.post("/", authMiddleware, roleMiddleware(roles.GYM_OWNER), memberController.createMember);
router.get("/", authMiddleware, roleMiddleware(roles.GYM_OWNER), memberController.getMembers);
router.put("/:memberId", authMiddleware, roleMiddleware(roles.GYM_OWNER), memberController.updateMember);
router.delete("/:memberId", authMiddleware, roleMiddleware(roles.GYM_OWNER), memberController.deleteMember);

module.exports = router;
