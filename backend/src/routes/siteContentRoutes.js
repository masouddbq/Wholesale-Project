const express = require("express");

const {
  getContentBySlug,
  getAllContents,
  createContent,
  updateContent,
  deleteContent,
} = require("../controllers/siteContentController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

// Admin
router.get(
  "/",
  protect,
  adminOnly,
  asyncHandler(getAllContents)
);

router.post(
  "/",
  protect,
  adminOnly,
  asyncHandler(createContent)
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(updateContent)
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(deleteContent)
);

// Public
router.get(
  "/:slug",
  asyncHandler(getContentBySlug)
);

module.exports = router;