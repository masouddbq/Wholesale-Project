const express = require("express");

const {
  uploadProductImages,
  uploadCategoryImage,
  uploadSiteContentImage,
} = require("../controllers/uploadController");

const protect = require("../middlewares/authMiddleware");

const adminOnly = require("../middlewares/adminMiddleware");

const siteContentUpload = require("../middlewares/siteContentUploadMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const categoryUpload = require(
  "../middlewares/categoryUploadMiddleware"
);

const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.post(
  "/products",
  protect,
  adminOnly,
  upload.array("images", 5),
  asyncHandler(uploadProductImages)
);

router.post(
  "/categories",
  protect,
  adminOnly,
  categoryUpload.single("image"),
  asyncHandler(uploadCategoryImage)
);

router.post(
  "/site-content",
  protect,
  adminOnly,
  siteContentUpload.single("image"),
  asyncHandler(uploadSiteContentImage)
);

module.exports = router;