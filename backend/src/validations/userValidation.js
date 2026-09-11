const { z } = require("zod");

const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
});

const addressSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),

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

const updateAddressSchema = addressSchema.partial();

module.exports = {
  updateUserSchema,
  addressSchema,
  updateAddressSchema,
};