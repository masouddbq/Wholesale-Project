import type { CartColorGroup } from "@/lib/cartGroups";

type CompactVariantSummaryProps = {
  colors: CartColorGroup[];
  className?: string;
};

export default function CompactVariantSummary({
  colors,
  className = "",
}: CompactVariantSummaryProps) {
  const uniqueSizes = Array.from(
    new Set(colors.flatMap((color) => color.sizes.filter(Boolean))),
  );
  const uniqueColors = colors.map((color) => color.color).filter(Boolean);
  const packQty = colors[0]?.packCount;
  const sameQty = colors.every((color) =>
    color.sizeLines.every((line) => line.quantity === packQty),
  );

  return (
    <div className={`space-y-2 text-xs text-neutral-600 ${className}`.trim()}>
      {uniqueColors.length > 0 && (
        <div>
          <p className="mb-1 text-[11px] text-neutral-500">رنگ</p>
          <div className="flex flex-wrap gap-1">
            {uniqueColors.map((color) => (
              <span
                key={color}
                className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] leading-4"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      )}

      {uniqueSizes.length > 0 && (
        <div>
          <p className="mb-1 text-[11px] text-neutral-500">سایز</p>
          <div className="flex flex-wrap gap-1">
            {uniqueSizes.map((size) => (
              <span
                key={size}
                className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] leading-4"
              >
                {size}
              </span>
            ))}
          </div>
          {sameQty && packQty ? (
            <p className="mt-1 text-[11px] text-neutral-500">
              هر سایز {packQty.toLocaleString("fa-IR")} عدد
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
