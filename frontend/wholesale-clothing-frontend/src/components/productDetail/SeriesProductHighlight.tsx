import { sizeLabel } from "@/lib/productOptions";

type SeriesVariant = {
  size: string;
  sizeSlot?: number;
  color: string;
  colorHex?: string;
};

type SeriesProductHighlightProps = {
  description?: string;
  minimumOrderQuantity: number;
  variants: SeriesVariant[];
};

export default function SeriesProductHighlight({
  description,
  minimumOrderQuantity,
  variants,
}: SeriesProductHighlightProps) {
  const colors = Array.from(
    variants
      .reduce((map, variant) => {
        const key = variant.colorHex || variant.color;
        if (!map.has(key)) {
          map.set(key, {
            name: variant.color,
            hex: variant.colorHex || "",
          });
        }
        return map;
      }, new Map<string, { name: string; hex: string }>())
      .values(),
  );

  const sizes = Array.from(
    new Set(
      variants.map((variant) => sizeLabel(variant.size, variant.sizeSlot)),
    ),
  );

  return (
    <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
      <p className="text-base font-bold text-amber-900">این محصول سری است</p>
      <p className="mt-2 text-sm leading-7 text-neutral-800">
        این سری کامل فروخته می‌شود. رنگ یا سایز جداگانه انتخاب نمی‌شود.
      </p>

      {description && (
        <p className="mt-4 text-sm leading-7 text-neutral-800">{description}</p>
      )}

      <div className="mt-5">
        <p className="text-xs font-medium text-neutral-600">رنگ‌های سری</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color) => (
            <span
              key={`${color.hex}-${color.name}`}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-sm"
            >
              <span
                className="h-4 w-4 rounded-full border border-neutral-200"
                style={{ backgroundColor: color.hex || "#d4d4d4" }}
              />
              {color.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-neutral-600">سایزهای سری</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sizes.map((size) => (
            <span
              key={size}
              className="rounded-md bg-white px-2 py-1 text-xs text-neutral-800"
            >
              {size}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-neutral-600">
        هر سری {variants.length.toLocaleString("fa-IR")} عدد است (
        {colors.length.toLocaleString("fa-IR")} رنگ ×{" "}
        {sizes.length.toLocaleString("fa-IR")} سایز). حداقل سفارش:{" "}
        {minimumOrderQuantity.toLocaleString("fa-IR")} سری.
      </p>
    </div>
  );
}
