const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const {
  apiLimiter,
  authLimiter,
} = require("./middlewares/rateLimitMiddleware");

const path = require("path");

const errorHandler = require("./middlewares/errorMiddleware");
const uploadRoutes = require("./routes/uploadRoutes");

const categoryRoutes = require("./routes/categRoutes");
const productRoutes = require("./routes/prodsRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiLimiter);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

app.get("/", (req, res) => {
  res.json({
    message: "Wholesale Clothing API is running",
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);


app.use(errorHandler);

module.exports = app;