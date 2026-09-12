const { z } = require("zod");

const variantSchema = z.object({
  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(50, "Size must be at most 50 characters"),

  color: z
    .string()
    .trim()
    .min(1, "Color is required")
    .max(50, "Color must be at most 50 characters"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(100, "SKU must be at most 100 characters"),
});

const variantsSchema = z
  .array(variantSchema)
  .optional()
  .superRefine((variants, ctx) => {
    const skuIndexes = new Map();

    variants.forEach((variant, index) => {
      const sku = variant.sku;

      if (!skuIndexes.has(sku)) {
        skuIndexes.set(sku, index);
        return;
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SKU must be unique within the product",
        path: [index, "sku"],
      });
    });
  });

const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must be at most 150 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(150, "Slug must be at most 150 characters"),

  description: z
    .string()
    .trim()
    .optional(),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  images: z
    .array(z.string().trim())
    .optional(),

  category: z
    .string()
    .min(1, "Category is required"),

  variants: variantsSchema,

  minimumOrderQuantity: z
    .number()
    .int("Minimum order quantity must be an integer")
    .min(
      1,
      "Minimum order quantity must be at least 1"
    ),

  isActive: z
    .boolean()
    .optional(),
});

const updateProductSchema =
  createProductSchema.partial();

module.exports = {
  createProductSchema,
  updateProductSchema,
};

