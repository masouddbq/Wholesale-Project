const express = require("express");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorMiddleware");

const categoryRoutes = require("./routes/categRoutes");
const productRoutes = require("./routes/prodsRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

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

app.use(errorHandler);

module.exports = app;