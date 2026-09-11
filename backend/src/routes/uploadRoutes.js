const express = require("express");

const {
  uploadProductImages,
} = require("../controllers/uploadController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.post(
  "/products",
  protect,
  adminOnly,
  upload.array("images", 5),
  asyncHandler(uploadProductImages)
);

module.exports = router;