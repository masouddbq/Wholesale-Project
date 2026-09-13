const express = require("express");

const { register, login, getMe , logout } = require("../controllers/authController");

const { authLimiter } = require("../middlewares/rateLimitMiddleware");

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
  authLimiter,
  validate(registerSchema),
  asyncHandler(register),
);

router.post("/login", authLimiter, validate(loginSchema), asyncHandler(login));

router.get("/me", protect, asyncHandler(getMe));

router.post("/logout", logout);

module.exports = router;
