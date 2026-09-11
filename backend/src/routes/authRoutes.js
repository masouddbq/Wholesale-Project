const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

router.get(
  "/me",
  protect,
  asyncHandler(getMe)
);

module.exports = router;