const express = require("express");
const router = express.Router();

const gymController = require("../controllers/gym.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const roles = require("../constants/roles");

// SUPER_ADMIN → CRUD GYMS
router.get(
  "/",
  authMiddleware,
  roleMiddleware(roles.SUPER_ADMIN),
  gymController.getAllGyms
);

router.put(
  "/:gymId",
  authMiddleware,
  roleMiddleware(roles.SUPER_ADMIN),
  gymController.updateGym
);

router.delete(
  "/:gymId",
  authMiddleware,
  roleMiddleware(roles.SUPER_ADMIN),
  gymController.deleteGym
);

module.exports = router;
