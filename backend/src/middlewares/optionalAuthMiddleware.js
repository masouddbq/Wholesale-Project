const jwt = require("jsonwebtoken");
const User = require("../models/User");

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // کاربر مهمان است
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "-passwordHash"
    );

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // حتی اگر توکن نامعتبر باشد،
    // سفارش مهمان همچنان می‌تواند ثبت شود.
    next();
  }
};

module.exports = optionalAuth;