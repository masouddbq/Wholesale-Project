const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

// POST /api/orders
const createOrder = async (req, res) => {
  const { customer, items, note } = req.body;

  const orderItems = [];
  let totalAmount = 0;
  const itemKeys = new Set();

  for (const item of items) {
    const {
      product,
      variantId,
      quantity,
    } = item;

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const itemKey = `${product}-${variantId || "no-variant"}`;

    if (itemKeys.has(itemKey)) {
      return res.status(400).json({
        message:
          "Duplicate product variant in order",
      });
    }

    itemKeys.add(itemKey);

    const productDoc = await Product.findOne({
      _id: product,
      isActive: true,
    });

    if (!productDoc) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let selectedVariant = null;

    if (productDoc.variants.length > 0) {
      if (!variantId) {
        return res.status(400).json({
          message:
            `Variant is required for product: ${productDoc.name}`,
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          variantId
        )
      ) {
        return res.status(400).json({
          message: "Invalid variant ID",
        });
      }

      selectedVariant =
        productDoc.variants.id(variantId);

      if (!selectedVariant) {
        return res.status(404).json({
          message:
            `Variant not found for product: ${productDoc.name}`,
        });
      }

      if (selectedVariant.stock < quantity) {
        return res.status(409).json({
          message:
            `Not enough stock for product: ${productDoc.name}`,
          availableStock:
            selectedVariant.stock,
        });
      }
    }

    if (
      quantity <
      productDoc.minimumOrderQuantity
    ) {
      return res.status(400).json({
        message:
          `Minimum order quantity for ${productDoc.name} is ${productDoc.minimumOrderQuantity}`,
      });
    }

    const itemTotal =
      productDoc.price * quantity;

    totalAmount += itemTotal;

    orderItems.push({
      product: productDoc._id,
      name: productDoc.name,
      image: productDoc.images?.[0],
      price: productDoc.price,
      quantity,
      size: selectedVariant?.size,
      color: selectedVariant?.color,
      sku: selectedVariant?.sku,
    });
  }

  // فعلاً Transaction نداریم.
  // در مرحله Production این بخش Transaction خواهد شد.
  for (const item of items) {
    if (!item.variantId) {
      continue;
    }

    const result = await Product.updateOne(
      {
        _id: item.product,
        "variants._id": item.variantId,
        "variants.stock": {
          $gte: item.quantity,
        },
      },
      {
        $inc: {
          "variants.$.stock": -item.quantity,
        },
      }
    );

    if (result.modifiedCount !== 1) {
      return res.status(409).json({
        message:
          "Stock changed while creating the order. Please try again.",
      });
    }
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user?._id || null,
    customer: {
      name: customer.name,
      phone: customer.phone,
      province: customer.province,
      city: customer.city,
      address: customer.address,
      postalCode: customer.postalCode,
    },
    items: orderItems,
    totalAmount,
    status: "pending",
    paymentStatus: "unpaid",
    note,
  });

  res.status(201).json({
    message: "Order created successfully",
    order: {
      id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items,
      customer: order.customer,
      createdAt: order.createdAt,
    },
  });
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders,
  });
};

// GET /api/orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name phone role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders,
  });
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  const order = await Order.findById(
    req.params.id
  )
    .populate("user", "name phone role")
    .populate(
      "statusHistory.changedBy",
      "name phone role"
    );

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  res.status(200).json({
    order,
  });
};

// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "shipped",
    "completed",
    "cancelled",
  ];

  if (
    !status ||
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      message: "Invalid order status",
      allowedStatuses,
    });
  }

  const order = await Order.findById(
    req.params.id
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  if (order.status === status) {
    return res.status(400).json({
      message: `Order is already ${status}`,
    });
  }

  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["shipped", "cancelled"],
    shipped: ["completed"],
    completed: [],
    cancelled: [],
  };

  if (
    !validTransitions[order.status].includes(
      status
    )
  ) {
    return res.status(400).json({
      message:
        `Cannot change order status from ${order.status} to ${status}`,
    });
  }

  const previousStatus = order.status;

  // فعلاً Transaction نداریم.
  // در Production باید این بخش با Transaction انجام شود.
  if (status === "cancelled") {
    for (const item of order.items) {
      if (!item.product) continue;
      if (!item.sku) continue;

      const result = await Product.updateOne(
        {
          _id: item.product,
          variants: {
            $elemMatch: {
              sku: item.sku,
              size: item.size,
              color: item.color,
            },
          },
        },
        {
          $inc: {
            "variants.$.stock": item.quantity,
          },
        }
      );

      if (result.modifiedCount !== 1) {
        return res.status(409).json({
          message:
            `Failed to restore stock for ${item.name}`,
        });
      }
    }
  }

  order.status = status;

  order.statusHistory.push({
    status,
    previousStatus,
    changedBy: req.user._id,
    changedAt: new Date(),
  });

  await order.save();

  res.status(200).json({
    message:
      "Order status updated successfully",
    order,
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};