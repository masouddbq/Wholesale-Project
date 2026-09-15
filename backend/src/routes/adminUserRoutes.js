const express = require("express");

const {
  getAdminUsers,
  getAdminUser,
  updateUserRole,
} = require("../controllers/adminUserController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get(
  "/",
  asyncHandler(getAdminUsers)
);

router.get(
  "/:id",
  asyncHandler(getAdminUser)
);

router.patch(
  "/:id/role",
  asyncHandler(updateUserRole)
);

module.exports = router;