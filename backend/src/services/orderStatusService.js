const Order = require("../models/Order");
const Product = require("../models/Product");

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "completed",
  "cancelled",
];

const VALID_TRANSITIONS = {
  pending: ["confirmed", "preparing", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["shipped", "cancelled"],
  shipped: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const applyOrderStatusChange = async ({
  orderId,
  status,
  changedByUserId = null,
}) => {
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return {
      ok: false,
      code: 400,
      message: "Invalid order status",
    };
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return {
      ok: false,
      code: 404,
      message: "Order not found",
    };
  }

  if (order.status === status) {
    return {
      ok: false,
      code: 400,
      message: `Order is already ${status}`,
      order,
    };
  }

  if (!VALID_TRANSITIONS[order.status].includes(status)) {
    return {
      ok: false,
      code: 400,
      message: `Cannot change order status from ${order.status} to ${status}`,
      order,
    };
  }

  const previousStatus = order.status;

  if (status === "cancelled") {
    for (const item of order.items) {
      if (!item.product || !item.sku) {
        continue;
      }

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
        return {
          ok: false,
          code: 409,
          message: `Failed to restore stock for ${item.name}`,
        };
      }
    }
  }

  order.status = status;
  order.statusHistory.push({
    status,
    previousStatus,
    changedBy: changedByUserId || undefined,
    changedAt: new Date(),
  });

  await order.save();

  return {
    ok: true,
    order,
  };
};

module.exports = {
  ALLOWED_STATUSES,
  VALID_TRANSITIONS,
  applyOrderStatusChange,
};
