const express = require("express");

const {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductById,
  getAdminProducts,
} = require("../controllers/prodsController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const validate = require("../middlewares/validateMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/productValidation");

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  validate(createProductSchema),
  asyncHandler(createProduct)
);

router.get(
  "/",
  asyncHandler(getProducts)
);

router.get(
  "/id/:id",
  protect,
  adminOnly,
  asyncHandler(getProductById)
);

router.get(
  "/admin",
  protect,
  adminOnly,
  asyncHandler(getAdminProducts)
);

router.get(
  "/:slug",
  asyncHandler(getProductBySlug)
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  validate(updateProductSchema),
  asyncHandler(updateProduct)
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(deleteProduct)
);

module.exports = router;