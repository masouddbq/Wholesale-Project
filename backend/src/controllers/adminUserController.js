const mongoose = require("mongoose");

const User = require("../models/User");
const Order = require("../models/Order");

// GET /api/admin/users

const getAdminUsers = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    role,
    sort = "newest",
  } = req.query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(
    Math.max(Number(limit), 1),
    100
  );

  const skip =
    (pageNumber - 1) * limitNumber;

  const filter = {};

  if (search.trim()) {
    const searchRegex = new RegExp(
      search.trim(),
      "i"
    );

    filter.$or = [
      { name: searchRegex },
      { phone: searchRegex },
    ];
  }

  if (
    role &&
    ["customer", "admin"].includes(role)
  ) {
    filter.role = role;
  }

  let sortOption = {
    createdAt: -1,
  };

  if (sort === "oldest") {
    sortOption = {
      createdAt: 1,
    };
  }

  if (sort === "name") {
    sortOption = {
      name: 1,
    };
  }

  const [users, totalUsers] =
    await Promise.all([
      User.find(filter)
        .select(
          "_id name phone role createdAt updatedAt"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      User.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(
    totalUsers / limitNumber
  );

  res.status(200).json({
    users,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalUsers,
      totalPages,
    },
  });
};

// GET /api/admin/users/:id

const getAdminUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const user = await User.findById(id)
    .select("-passwordHash")
    .lean();

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const orders = await Order.find({
    user: user._id,
  })
    .select(
      "orderNumber totalAmount status createdAt"
    )
    .sort({
      createdAt: -1,
    })
    .lean();

  res.status(200).json({
    user,
    orders,
  });
};

// PATCH /api/admin/users/:id/role

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  if (!["customer", "admin"].includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (
    user._id.equals(req.user._id) &&
    role !== "admin"
  ) {
    return res.status(400).json({
      message:
        "You cannot remove your own admin role",
    });
  }

  user.role = role;

  await user.save();

  res.status(200).json({
    message: "User role updated successfully",
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  });
};

module.exports = {
  getAdminUsers,
  getAdminUser,
  updateUserRole,
};