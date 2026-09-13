const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  const [
    totalOrders,
    pendingOrders,
    totalProducts,
    totalUsers,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Product.countDocuments({ isActive: true }),
    User.countDocuments(),
  ]);

  res.json({
    stats: {
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
    },
  });
};

module.exports = {
  getDashboardStats,
};