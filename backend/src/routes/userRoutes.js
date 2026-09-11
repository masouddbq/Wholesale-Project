const express = require("express");

const {
  getMe,
  updateMe,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/userController");

const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const {
  updateUserSchema,
  addressSchema,
  updateAddressSchema,
} = require("../validations/userValidation");

const router = express.Router();

router.use(protect);

router.get(
  "/me",
  asyncHandler(getMe)
);

router.patch(
  "/me",
  validate(updateUserSchema),
  asyncHandler(updateMe)
);

router.post(
  "/me/addresses",
  validate(addressSchema),
  asyncHandler(addAddress)
);

router.patch(
  "/me/addresses/:addressId",
  validate(updateAddressSchema),
  asyncHandler(updateAddress)
);

router.delete(
  "/me/addresses/:addressId",
  asyncHandler(deleteAddress)
);

module.exports = router;