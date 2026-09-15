const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryBySlug,
  getAdminCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const validate = require("../middlewares/validateMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validations/categoryValidation");

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  validate(createCategorySchema),
  asyncHandler(createCategory)
);

router.get(
  "/",
  asyncHandler(getCategories)
);

router.get(
  "/admin",
  protect,
  adminOnly,
  asyncHandler(getAdminCategories)
);

router.get("/test-admin", (req, res) => {
  res.json({
    message: "category admin route works",
  });
});

router.get(
  "/:slug",
  asyncHandler(getCategoryBySlug)
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  validate(updateCategorySchema),
  asyncHandler(updateCategory)
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(deleteCategory)
);


module.exports = router;
