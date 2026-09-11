const { z } = require("zod");

const orderItemSchema = z.object({
  product: z
    .string()
    .trim()
    .min(1, "Product is required"),

  variantId: z
    .string()
    .trim()
    .optional(),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  phone: z
    .string()
    .trim()
    .min(10, "Invalid phone number")
    .max(20, "Invalid phone number"),

  province: z
    .string()
    .trim()
    .min(1, "Province is required")
    .max(100, "Province must be at most 100 characters"),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address must be at most 500 characters"),

  postalCode: z
    .string()
    .trim()
    .optional(),
});

const createOrderSchema = z.object({
  customer: customerSchema,

  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item")
    .max(50, "Order cannot contain more than 50 items"),

  note: z
    .string()
    .trim()
    .max(1000, "Note must be at most 1000 characters")
    .optional(),
});

module.exports = {
  createOrderSchema,
};