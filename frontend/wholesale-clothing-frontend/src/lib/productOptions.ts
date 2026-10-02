export const PRODUCT_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];
export type SizeSlot = 1 | 2;

export type SizeKey = `${ProductSize}:${SizeSlot}`;

export const SIZE_CHECKBOXES: { size: ProductSize; slot: SizeSlot; key: SizeKey }[] =
  PRODUCT_SIZES.flatMap((size) =>
    ([1, 2] as SizeSlot[]).map((slot) => ({
      size,
      slot,
      key: `${size}:${slot}` as SizeKey,
    })),
  );

export const COLOR_PALETTE = [
  { hex: "#111111", name: "مشکی" },
  { hex: "#FFFFFF", name: "سفید" },
  { hex: "#6B7280", name: "طوسی" },
  { hex: "#1E3A5F", name: "سرمه‌ای" },
  { hex: "#D4C4A8", name: "کرم" },
  { hex: "#8B5A2B", name: "قهوه‌ای" },
  { hex: "#B91C1C", name: "قرمز" },
  { hex: "#7F1D1D", name: "زرشکی" },
  { hex: "#166534", name: "سبز" },
  { hex: "#6B8E23", name: "زیتونی" },
  { hex: "#1D4ED8", name: "آبی" },
  { hex: "#EC4899", name: "صورتی" },
  { hex: "#F5F5DC", name: "بژ" },
  { hex: "#C3B091", name: "خاکی" },
  { hex: "#CA8A04", name: "طلایی" },
] as const;

export type SaleType = "series" | "selective";

export const sizeKey = (size: string, slot: number): string => `${size}:${slot}`;

export const sizeLabel = (size: string, slot?: number) =>
  slot && slot > 1 ? `${size} (${slot})` : size;

export const MAX_PACK_PIECES = SIZE_CHECKBOXES.length;
