"use client";

import { useMemo, useState } from "react";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/components/Toast";
import { formatMoney } from "@/lib/formatPrice";
import { sizeLabel, type SaleType } from "@/lib/productOptions";
import type { AvailabilityStatus } from "@/lib/availability";
import useAuthStore from "@/store/authStore";
import { canSeeExactStock } from "@/lib/roles";

type Variant = {
  _id: string;
  size: string;
  sizeSlot?: number;
  color: string;
  colorHex?: string;
  stock: number;
  sku: string;
};

type ColorGroup = {
  key: string;
  color: string;
  colorHex: string;
  variants: Variant[];
};

type ProductVariantSelectorProps = {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  price: number;
  variants: Variant[];
  minimumOrderQuantity: number;
  saleType?: SaleType;
  availabilityStatus?: AvailabilityStatus;
};

const colorKey = (color: string, colorHex?: string) => colorHex || color;

const groupStock = (group: ColorGroup) =>
  group.variants.reduce((total, variant) => total + (variant.stock || 0), 0);

const packStock = (group: ColorGroup) => group.variants[0]?.stock || 0;

export default function ProductVariantSelector({
  productId,
  productName,
  productSlug,
  productImage,
  price,
  variants,
  minimumOrderQuantity,
  saleType = "selective",
  availabilityStatus = "in_stock",
}: ProductVariantSelectorProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addToast } = useToast();
  const role = useAuthStore((state) => state.user?.role);
  const showExactStock = canSeeExactStock(role);
  const isUnavailable = availabilityStatus === "out_of_stock";
  const isSeries = saleType === "series";

  const colorGroups = useMemo(() => {
    const map = new Map<string, ColorGroup>();

    variants.forEach((variant) => {
      const key = colorKey(variant.color, variant.colorHex);
      const current = map.get(key) || {
        key,
        color: variant.color,
        colorHex: variant.colorHex || "",
        variants: [],
      };
      current.variants.push(variant);
      map.set(key, current);
    });

    return Array.from(map.values());
  }, [variants]);

  const [selectedColorKey, setSelectedColorKey] = useState(
    colorGroups[0]?.key || "",
  );
  const [seriesPackQty, setSeriesPackQty] = useState(1);
  const [qtyByVariant, setQtyByVariant] = useState<Record<string, number>>({});

  const activeGroup =
    colorGroups.find((group) => group.key === selectedColorKey) || colorGroups[0];

  const seriesStock = colorGroups.reduce((lowest, group) => {
    const stock = packStock(group);
    return lowest === null ? stock : Math.min(lowest, stock);
  }, null as number | null);
  const piecesPerSeries = variants.length;
  const seriesPieces = piecesPerSeries * seriesPackQty;

  const qtyOf = (id: string) => qtyByVariant[id] || 0;

  const selectivePicks = variants.filter((variant) => qtyOf(variant._id) > 0);
  const selectivePieces = selectivePicks.reduce(
    (total, variant) => total + qtyOf(variant._id),
    0,
  );

  const seriesReady =
    colorGroups.length > 0 &&
    seriesPackQty >= Math.max(1, minimumOrderQuantity) &&
    (seriesStock === null || seriesStock <= 0 || seriesPackQty <= seriesStock);

  const selectiveReady =
    selectivePieces >= minimumOrderQuantity &&
    selectivePicks.every((variant) => qtyOf(variant._id) <= (variant.stock || 0));

  const canAddToCart = isSeries ? seriesReady : selectiveReady;
  const totalPieces = isSeries ? seriesPieces : selectivePieces;

  const updateSeriesPackQty = (next: number) => {
    const maxQty =
      seriesStock && seriesStock > 0 ? seriesStock : Math.max(next, 1);
    setSeriesPackQty(Math.max(1, Math.min(next, maxQty)));
  };

  const updateVariantQty = (variant: Variant, next: number) => {
    const safe = Math.max(0, Math.min(next, variant.stock || 0));
    setQtyByVariant((current) => ({
      ...current,
      [variant._id]: safe,
    }));
  };

  const handleAddToCart = () => {
    if (isUnavailable) {
      addToast("این محصول ناموجود است.", "error");
      return;
    }
    if (!canAddToCart) {
      addToast(
        isSeries
          ? "این سری کامل را با تعداد مجاز سفارش دهید."
          : `حداقل ${minimumOrderQuantity.toLocaleString("fa-IR")} عدد انتخاب کنید.`,
        "error",
      );
      return;
    }

    if (isSeries) {
      variants.forEach((variant) => {
        addItem({
          productId,
          name: productName,
          slug: productSlug,
          image: productImage,
          price,
          variantId: variant._id,
          size: sizeLabel(variant.size, variant.sizeSlot),
          color: variant.color,
          sku: variant.sku,
          quantity: seriesPackQty,
          minimumOrderQuantity: 1,
          stock: variant.stock,
        });
      });
    } else {
      selectivePicks.forEach((variant) => {
        addItem({
          productId,
          name: productName,
          slug: productSlug,
          image: productImage,
          price,
          variantId: variant._id,
          size: sizeLabel(variant.size, variant.sizeSlot),
          color: variant.color,
          sku: variant.sku,
          quantity: qtyOf(variant._id),
          minimumOrderQuantity: 1,
          stock: variant.stock,
        });
      });
    }

    addToast("انتخاب‌ها به سبد خرید اضافه شد", "success");
  };

  if (!variants.length) {
    return null;
  }

  const showPackStepper = isSeries && colorGroups.length > 0;

  const selectiveByColor = colorGroups
    .map((group) => ({
      group,
      lines: group.variants
        .filter((variant) => qtyOf(variant._id) > 0)
        .map((variant) => ({
          size: sizeLabel(variant.size, variant.sizeSlot),
          qty: qtyOf(variant._id),
        })),
    }))
    .filter((entry) => entry.lines.length > 0);

  return (
    <div className="mt-8 space-y-6">
      {!isSeries && (
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
        <p className="text-sm font-bold">محصول انتخابی</p>
        <p className="mt-1 text-xs leading-6">
          از هر رنگ و سایز به تعداد دلخواه انتخاب کنید.
        </p>
      </div>
      )}

      {!isSeries && (
      <div>
        <h3 className="mb-3 text-sm font-semibold">رنگ</h3>
        <p className="mb-3 text-xs text-neutral-500">
          رنگ را بزنید و برای هر سایز تعداد بگذارید.
        </p>
        <div className="flex flex-wrap gap-2">
          {colorGroups.map((group) => {
            const focused = group.key === activeGroup?.key;
            const included = group.variants.some((variant) => qtyOf(variant._id) > 0);

            return (
              <div key={group.key} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedColorKey(group.key)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${
                    focused
                      ? "border-black bg-black text-white"
                      : included
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-neutral-300 bg-white"
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-white/40"
                    style={{ backgroundColor: group.colorHex || "#d4d4d4" }}
                  />
                  {group.color}
                </button>
                {showExactStock && (
                  <span className="text-[10px] text-neutral-400">
                    موجودی: {groupStock(group).toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      )}

      {activeGroup && !isSeries && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">
            سایزهای {activeGroup.color}
          </h3>
          <div className="space-y-3">
            {activeGroup.variants.map((variant) => {
              const qty = qtyOf(variant._id);
              const max = variant.stock || 0;

              return (
                <div
                  key={variant._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {sizeLabel(variant.size, variant.sizeSlot)}
                    </p>
                    {showExactStock && (
                      <p className="text-xs text-neutral-500">
                        موجودی: {max.toLocaleString("fa-IR")}
                      </p>
                    )}
                  </div>
                  <div className="flex w-fit items-center overflow-hidden rounded-lg border border-neutral-300">
                    <button
                      type="button"
                      onClick={() => updateVariantQty(variant, qty - 1)}
                      className="flex h-10 w-10 items-center justify-center text-lg hover:bg-neutral-100"
                    >
                      −
                    </button>
                    <span className="flex h-10 min-w-12 items-center justify-center border-x border-neutral-300 px-2 text-sm font-semibold">
                      {qty.toLocaleString("fa-IR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateVariantQty(variant, qty + 1)}
                      disabled={qty >= max}
                      className="flex h-10 w-10 items-center justify-center text-lg hover:bg-neutral-100 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showPackStepper && (
        <div>
          {showExactStock && (
            <p className="mb-2 text-xs text-neutral-500">
              موجودی سری: {(seriesStock || 0).toLocaleString("fa-IR")}
            </p>
          )}
          <h3 className="mb-3 text-sm font-semibold">تعداد سری</h3>
          <div className="flex w-fit items-center overflow-hidden rounded-lg border border-neutral-300">
            <button
              type="button"
              onClick={() => updateSeriesPackQty(seriesPackQty - 1)}
              className="flex h-11 w-11 items-center justify-center text-lg hover:bg-neutral-100"
            >
              −
            </button>
            <span className="flex h-11 min-w-14 items-center justify-center border-x border-neutral-300 px-3 font-semibold">
              {seriesPackQty.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              onClick={() => updateSeriesPackQty(seriesPackQty + 1)}
              className="flex h-11 w-11 items-center justify-center text-lg hover:bg-neutral-100"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            هر سری {piecesPerSeries.toLocaleString("fa-IR")} عدد است. حداقل سفارش{" "}
            {minimumOrderQuantity.toLocaleString("fa-IR")} سری.
          </p>
        </div>
      )}

      {selectiveByColor.length > 0 && (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm">
          <p className="font-medium">انتخاب‌های فعلی</p>
          <ul className="mt-2 space-y-1 text-neutral-700">
            {selectiveByColor.map((entry) => (
                <li key={entry.group.key}>
                  <span className="font-medium">{entry.group.color}</span>
                  <span className="text-neutral-500">
                    {" "}
                    —{" "}
                    {entry.lines
                      .map(
                        (line) =>
                          `${line.size}: ${line.qty.toLocaleString("fa-IR")}`,
                      )
                      .join("، ")}
                  </span>
                </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">تعداد در این سفارش</h3>
        <div className="flex w-fit items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
          <span className="flex h-11 min-w-16 items-center justify-center px-4 font-semibold">
            {totalPieces.toLocaleString("fa-IR")}
          </span>
        </div>
        <p className="mt-2 text-sm">
          مبلغ:{" "}
          <strong>{formatMoney(price * totalPieces)} تومان</strong>
        </p>
      </div>

      <button
        type="button"
        disabled={isUnavailable || !canAddToCart}
        onClick={handleAddToCart}
        className="btn-primary-glow w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        افزودن به سبد خرید
      </button>
    </div>
  );
}
