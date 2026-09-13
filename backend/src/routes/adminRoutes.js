const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/adminController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  asyncHandler(getDashboardStats)
);

module.exports = router;