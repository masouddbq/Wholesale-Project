const express = require("express");

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const optionalAuth = require("../middlewares/optionalAuthMiddleware");
const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const validate = require("../middlewares/validateMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const {
  createOrderSchema,
} = require("../validations/orderValidation");

const router = express.Router();

router.post(
  "/",
  optionalAuth,
  validate(createOrderSchema),
  asyncHandler(createOrder)
);

router.get(
  "/my",
  protect,
  asyncHandler(getMyOrders)
);

router.get(
  "/my/:id",
  protect,
  asyncHandler(getMyOrderById)
);

router.get(
  "/",
  protect,
  adminOnly,
  asyncHandler(getAllOrders)
);

router.get(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(getOrderById)
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  asyncHandler(updateOrderStatus)
);



module.exports = router;