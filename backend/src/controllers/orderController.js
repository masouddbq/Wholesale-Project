const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const { applyOrderStatusChange } = require("../services/orderStatusService");
const {
  notifyAdminsNewOrder,
  notifyAdminsStatus,
  notifyCustomerStatus,
} = require("../services/rubikaNotify");

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
  const quantityByProduct = new Map();

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

    const productKey = String(productDoc._id);
    const previous = quantityByProduct.get(productKey);
    quantityByProduct.set(productKey, {
      name: productDoc.name,
      minimumOrderQuantity: productDoc.minimumOrderQuantity,
      saleType: productDoc.saleType,
      quantity:
        productDoc.saleType === "series"
          ? Math.max(previous?.quantity || 0, quantity)
          : (previous?.quantity || 0) + quantity,
    });

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

  for (const summary of quantityByProduct.values()) {
    if (summary.quantity < summary.minimumOrderQuantity) {
      const unit = summary.saleType === "series" ? "سری" : "عدد";
      return res.status(400).json({
        message:
          `حداقل تعداد سفارش برای «${summary.name}» ${summary.minimumOrderQuantity} ${unit} است.`,
      });
    }
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

  notifyAdminsNewOrder(order).catch((error) => {
    console.error("Rubika new-order notify failed", error);
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

// GET /api/orders/my/:id
const getMyOrderById = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  res.status(200).json({
    order,
  });
};

const getAllOrders = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    status = "",
    sort = "newest",
  } = req.query;

  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const skip = (safePage - 1) * safeLimit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search.trim()) {
    const searchRegex = new RegExp(
      search.trim(),
      "i"
    );

    filter.$or = [
      {
        orderNumber: searchRegex,
      },
      {
        "customer.name": searchRegex,
      },
      {
        "customer.phone": searchRegex,
      },
    ];
  }

  let sortOption = {
    createdAt: -1,
  };

  if (sort === "oldest") {
    sortOption = {
      createdAt: 1,
    };
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .select(
        "orderNumber customer.name customer.phone totalAmount status paymentStatus createdAt"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(
    total / safeLimit
  );

  res.json({
    orders,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
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
  const result = await applyOrderStatusChange({
    orderId: req.params.id,
    status: req.body.status,
    changedByUserId: req.user._id,
  });

  if (!result.ok) {
    return res.status(result.code || 400).json({
      message: result.message,
    });
  }

  notifyCustomerStatus(result.order).catch((error) => {
    console.error("Rubika customer notify failed", error);
  });
  notifyAdminsStatus(result.order).catch((error) => {
    console.error("Rubika admin notify failed", error);
  });

  res.status(200).json({
    message: "Order status updated successfully",
    order: result.order,
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};