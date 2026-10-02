const { z } = require("zod");

const emptyToUndefined = (value) =>
  value === "" || value === null || value === undefined ? undefined : value;

const orderItemSchema = z.object({
  product: z
    .string()
    .trim()
    .min(1, "شناسه محصول نامعتبر است"),

  variantId: z.preprocess(
    emptyToUndefined,
    z.string().trim().optional()
  ),

  quantity: z.coerce
    .number()
    .int("تعداد باید عدد صحیح باشد")
    .min(1, "تعداد باید حداقل ۱ باشد"),
});

const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .max(100, "نام خیلی طولانی است"),

  phone: z
    .string()
    .trim()
    .min(10, "شماره موبایل نامعتبر است")
    .max(20, "شماره موبایل نامعتبر است"),

  province: z
    .string()
    .trim()
    .min(1, "استان را وارد کنید")
    .max(100, "استان نامعتبر است"),

  city: z
    .string()
    .trim()
    .min(1, "شهر را وارد کنید")
    .max(100, "شهر نامعتبر است"),

  address: z
    .string()
    .trim()
    .min(1, "آدرس را وارد کنید")
    .max(500, "آدرس خیلی طولانی است"),

  postalCode: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(20, "کد پستی نامعتبر است").optional()
  ),
});

const createOrderSchema = z.object({
  customer: customerSchema,

  items: z
    .array(orderItemSchema)
    .min(1, "سبد خرید خالی است")
    .max(500, "تعداد اقلام سفارش بیش از حد مجاز است"),

  note: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(1000, "یادداشت خیلی طولانی است").optional()
  ),
});

module.exports = {
  createOrderSchema,
};
