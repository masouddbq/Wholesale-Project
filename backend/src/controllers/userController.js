const mongoose = require("mongoose");

const User = require("../models/User");

// GET /api/users/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-passwordHash"
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    user,
  });
};

// PATCH /api/users/me
const updateMe = async (req, res) => {
  const { name } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.name = name;

  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
    },
  });
};

// POST /api/users/me/addresses
const addAddress = async (req, res) => {
  const {
    title,
    province,
    city,
    address,
    postalCode,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.addresses.push({
    title,
    province,
    city,
    address,
    postalCode,
  });

  await user.save();

  const newAddress =
    user.addresses[user.addresses.length - 1];

  res.status(201).json({
    message: "Address added successfully",
    address: newAddress,
  });
};

// PATCH /api/users/me/addresses/:addressId
const updateAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    return res.status(400).json({
      message: "Invalid address ID",
    });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    return res.status(404).json({
      message: "Address not found",
    });
  }

  const {
    title,
    province,
    city,
    address: addressText,
    postalCode,
  } = req.body;

  if (title !== undefined) {
    address.title = title;
  }

  if (province !== undefined) {
    address.province = province;
  }

  if (city !== undefined) {
    address.city = city;
  }

  if (addressText !== undefined) {
    address.address = addressText;
  }

  if (postalCode !== undefined) {
    address.postalCode = postalCode;
  }

  await user.save();

  res.status(200).json({
    message: "Address updated successfully",
    address,
  });
};

// DELETE /api/users/me/addresses/:addressId
const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    return res.status(400).json({
      message: "Invalid address ID",
    });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    return res.status(404).json({
      message: "Address not found",
    });
  }

  address.deleteOne();

  await user.save();

  res.status(200).json({
    message: "Address deleted successfully",
  });
};

module.exports = {
  getMe,
  updateMe,
  addAddress,
  updateAddress,
  deleteAddress,
};