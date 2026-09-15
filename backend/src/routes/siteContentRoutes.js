const express = require("express");

const {
  getSiteContents,
  getSiteContent,
  upsertSiteContent,
} = require("../controllers/siteContentController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

// Public
router.get(
  "/",
  asyncHandler(getSiteContents)
);

router.get(
  "/:key",
  asyncHandler(getSiteContent)
);

// Admin
router.put(
  "/:key",
  protect,
  adminOnly,
  asyncHandler(upsertSiteContent)
);

module.exports = router;