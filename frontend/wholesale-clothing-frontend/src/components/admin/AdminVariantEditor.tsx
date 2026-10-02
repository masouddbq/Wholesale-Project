"use client";

import { useEffect, useState } from "react";
import {
  COLOR_PALETTE,
  MAX_PACK_PIECES,
  SIZE_CHECKBOXES,
  sizeKey,
  type SaleType,
} from "@/lib/productOptions";

export type ColorGroupForm = {
  id: string;
  colorHex: string;
  colorName: string;
  stock: string;
  slots: Record<string, boolean>;
  slotStocks: Record<string, string>;
};

export const emptyColorGroup = (): ColorGroupForm => ({
  id: globalThis.crypto?.randomUUID?.() || `color-${Date.now()}-${Math.random()}`,
  colorHex: "",
  colorName: "",
  stock: "0",
  slots: {},
  slotStocks: {},
});

export const groupsFromVariants = (
  variants: Array<{
    size: string;
    sizeSlot?: number;
    color: string;
    colorHex?: string;
    stock: number | string;
    sku: string;
  }>,
  saleType: SaleType = "selective",
): ColorGroupForm[] => {
  const groups = new Map<string, ColorGroupForm>();
  const unionSlots: Record<string, boolean> = {};
  let seriesStock = "0";

  variants.forEach((variant) => {
    const hex = variant.colorHex || variant.color;
    const key = `${hex}-${variant.color}`;
    const existing = groups.get(key) || {
      id: globalThis.crypto?.randomUUID?.() || `color-${Date.now()}-${Math.random()}`,
      colorHex: variant.colorHex || "",
      colorName: variant.color,
      stock: "0",
      slots: {},
      slotStocks: {},
    };

    const keyName = sizeKey(variant.size, variant.sizeSlot || 1);
    existing.slots[keyName] = true;
    unionSlots[keyName] = true;

    if (saleType === "series") {
      seriesStock = String(variant.stock);
      existing.stock = String(variant.stock);
    } else {
      existing.slotStocks[keyName] = String(variant.stock);
    }

    groups.set(key, existing);
  });

  if (saleType === "series") {
    return groups.size
      ? Array.from(groups.values()).map((group) => ({
          ...group,
          slots: { ...unionSlots },
          stock: seriesStock,
        }))
      : [emptyColorGroup()];
  }

  return groups.size ? Array.from(groups.values()) : [emptyColorGroup()];
};

export const flattenColorGroups = (
  groups: ColorGroupForm[],
  slug: string,
  saleType: SaleType = "selective",
) => {
  const variants: Array<{
    size: string;
    sizeSlot: number;
    color: string;
    colorHex: string;
    stock: number;
    sku: string;
  }> = [];

  const seriesColors = groups.filter((group) => group.colorName);
  const sharedSlots =
    saleType === "series"
      ? seriesColors[0]?.slots || {}
      : {};
  const packStock = Number(seriesColors[0]?.stock) || 0;

  const sourceGroups =
    saleType === "series"
      ? seriesColors.map((group) => ({
          ...group,
          slots: sharedSlots,
          stock: String(packStock),
        }))
      : groups;

  sourceGroups.forEach((group) => {
    if (!group.colorName) {
      return;
    }

    SIZE_CHECKBOXES.forEach(({ size, slot, key }) => {
      if (!group.slots[key]) {
        return;
      }

      const colorCode = group.colorHex.replace("#", "") || group.colorName;
      variants.push({
        size,
        sizeSlot: slot,
        color: group.colorName,
        colorHex: group.colorHex,
        stock:
          saleType === "series"
            ? packStock
            : Number(group.slotStocks?.[key] || 0),
        sku: `${slug}-${colorCode}-${size}-${slot}`
          .replace(/\s+/g, "-")
          .toUpperCase(),
      });
    });
  });

  return variants;
};

const slotCountOf = (slots: Record<string, boolean>) =>
  SIZE_CHECKBOXES.filter(({ key }) => slots[key]).length;

const slotSummary = (slots: Record<string, boolean>) =>
  SIZE_CHECKBOXES.filter(({ key }) => slots[key])
    .map(({ size, slot }) => (slot === 1 ? size : `${size} ۲`))
    .join("، ");

const colorStockOf = (group: ColorGroupForm) =>
  SIZE_CHECKBOXES.filter(({ key }) => group.slots[key]).reduce(
    (total, { key }) => total + (Number(group.slotStocks?.[key]) || 0),
    0,
  );

type AdminVariantEditorProps = {
  saleType: SaleType;
  onSaleTypeChange: (value: SaleType) => void;
  groups: ColorGroupForm[];
  onChange: (groups: ColorGroupForm[]) => void;
};

export default function AdminVariantEditor({
  saleType,
  onSaleTypeChange,
  groups,
  onChange,
}: AdminVariantEditorProps) {
  const [activeId, setActiveId] = useState(groups[0]?.id || "");

  useEffect(() => {
    if (!groups.some((group) => group.id === activeId)) {
      setActiveId(groups[0]?.id || "");
    }
  }, [groups, activeId]);

  const activeGroup = groups.find((group) => group.id === activeId) || groups[0];

  const configuredGroups = groups.filter((group) => group.colorHex);

  const updateGroup = (id: string, patch: Partial<ColorGroupForm>) => {
    onChange(
      groups.map((group) => (group.id === id ? { ...group, ...patch } : group)),
    );
  };

  const selectPaletteColor = (hex: string, name: string) => {
    if (saleType === "series") {
      const existing = groups.find((group) => group.colorHex === hex);
      if (existing) {
        const next = groups.filter((group) => group.id !== existing.id);
        onChange(next.length ? next : [emptyColorGroup()]);
        return;
      }

      const sharedSlots = configuredGroups[0]?.slots || {};
      const sharedStock = configuredGroups[0]?.stock || "0";
      const blank = groups.find((group) => !group.colorHex);
      if (blank) {
        updateGroup(blank.id, {
          colorHex: hex,
          colorName: name,
          slots: { ...sharedSlots },
          stock: sharedStock,
        });
        setActiveId(blank.id);
        return;
      }

      const next = emptyColorGroup();
      next.colorHex = hex;
      next.colorName = name;
      next.slots = { ...sharedSlots };
      next.stock = sharedStock;
      onChange([...groups, next]);
      setActiveId(next.id);
      return;
    }

    const existing = groups.find((group) => group.colorHex === hex);
    if (existing) {
      setActiveId(existing.id);
      return;
    }

    const blank = groups.find((group) => !group.colorHex);
    if (blank) {
      updateGroup(blank.id, { colorHex: hex, colorName: name });
      setActiveId(blank.id);
      return;
    }

    const next = emptyColorGroup();
    next.colorHex = hex;
    next.colorName = name;
    onChange([...groups, next]);
    setActiveId(next.id);
  };

  const toggleSlot = (key: string) => {
    if (saleType === "series") {
      const current = configuredGroups[0]?.slots || {};
      const slots = {
        ...current,
        [key]: !current[key],
      };

      onChange(
        groups.map((group) =>
          group.colorHex
            ? {
                ...group,
                slots,
              }
            : group,
        ),
      );
      return;
    }

    if (!activeGroup) {
      return;
    }

    onChange(
      groups.map((group) => {
        if (group.id !== activeGroup.id) {
          return group;
        }

        const slots = {
          ...group.slots,
          [key]: !group.slots[key],
        };
        const slotStocks = { ...group.slotStocks };

        if (slots[key]) {
          slotStocks[key] = slotStocks[key] || "0";
        } else {
          delete slotStocks[key];
        }

        return {
          ...group,
          slots,
          slotStocks,
        };
      }),
    );
  };

  const colorReady = Boolean(activeGroup?.colorHex);
  const seriesSlots = configuredGroups[0]?.slots || {};
  const sizesPerColor = slotCountOf(seriesSlots);
  const seriesTotalPieces = sizesPerColor * configuredGroups.length;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium">نوع فروش</p>
        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="saleType"
              checked={saleType === "selective"}
              onChange={() => onSaleTypeChange("selective")}
            />
            محصول انتخابی
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="saleType"
              checked={saleType === "series"}
              onChange={() => onSaleTypeChange("series")}
            />
            محصول سری
          </label>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          {saleType === "series"
            ? "رنگ‌ها را یک‌بار از پالت انتخاب کنید. سایزها را یک‌بار برای همه رنگ‌ها تیک بزنید. مشتری کل این سری را با هم می‌خرد."
            : "ترکیب پک را با چک‌باکس مشخص کنید. موجودی هر سایز را جدا از پک‌های سری وارد کنید تا فروش انتخابی از موجودی سری کم نکند."}
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 p-4">
        <p className="mb-2 text-xs font-medium">
          {saleType === "series"
            ? "۱. رنگ‌های سری را از پالت انتخاب کنید (چند رنگ با هم)"
            : "۱. رنگ را از پالت انتخاب کنید"}
        </p>
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((swatch) => {
            const selected =
              saleType === "series"
                ? groups.some((group) => group.colorHex === swatch.hex)
                : activeGroup?.colorHex === swatch.hex;
            const configured = groups.some((group) => group.colorHex === swatch.hex);

            return (
              <button
                key={swatch.hex}
                type="button"
                title={swatch.name}
                onClick={() => selectPaletteColor(swatch.hex, swatch.name)}
                className={`relative h-9 w-9 rounded-full border-2 ${
                  selected
                    ? "border-black ring-2 ring-black/20"
                    : configured
                      ? "border-emerald-500"
                      : "border-neutral-200"
                }`}
                style={{ backgroundColor: swatch.hex }}
              />
            );
          })}
        </div>

        {configuredGroups.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-neutral-500">
              {saleType === "series" ? "رنگ‌های این سری" : "رنگ‌های ذخیره‌شده"}
            </p>
            {configuredGroups.map((group) => {
              const summary = slotSummary(
                saleType === "series" ? seriesSlots : group.slots,
              );
              const isActive = group.id === activeGroup?.id;

              return (
                <div
                  key={group.id}
                  className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
                    saleType === "series" || isActive
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      saleType === "selective" && setActiveId(group.id)
                    }
                    className="flex min-w-0 flex-1 items-center gap-2 text-right"
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border border-neutral-200"
                      style={{ backgroundColor: group.colorHex }}
                    />
                    <span>
                      <span className="font-medium">{group.colorName}</span>
                      {saleType === "series" ? (
                        <span className="mt-0.5 block text-xs text-neutral-500">
                          تعداد این رنگ در سری:{" "}
                          {sizesPerColor.toLocaleString("fa-IR")}
                        </span>
                      ) : summary ? (
                        <span className="mt-0.5 block text-xs text-neutral-500">
                          سایز: {summary} — تعداد در پک:{" "}
                          {slotCountOf(group.slots).toLocaleString("fa-IR")}
                          {` — موجودی انتخابی: ${colorStockOf(group).toLocaleString("fa-IR")}`}
                        </span>
                      ) : (
                        <span className="mt-0.5 block text-xs text-amber-700">
                          هنوز سایزی تیک نخورده
                        </span>
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = groups.filter((item) => item.id !== group.id);
                      onChange(next.length ? next : [emptyColorGroup()]);
                    }}
                    className="shrink-0 text-xs text-neutral-500 hover:text-black"
                  >
                    حذف
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 rounded-lg bg-neutral-50 px-3 py-3">
          {saleType === "series" ? (
            <>
              <p className="text-xs font-medium">مجموع سری</p>
              <p className="mt-1 text-lg font-semibold">
                {configuredGroups.length.toLocaleString("fa-IR")} رنگ ×{" "}
                {sizesPerColor.toLocaleString("fa-IR")} سایز ={" "}
                {seriesTotalPieces.toLocaleString("fa-IR")} عدد
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                تعداد هر رنگ برابر تعداد تیک سایزهاست. مجموع از ضرب رنگ‌ها در
                سایزها به‌دست می‌آید.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium">تعداد در پک / تعداد در سری</p>
              <p className="mt-1 text-lg font-semibold">
                {slotCountOf(activeGroup?.slots || {}).toLocaleString("fa-IR")} از{" "}
                {MAX_PACK_PIECES.toLocaleString("fa-IR")}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                از روی تیک چک‌باکس‌ها حساب می‌شود. هر تیک یک عدد در پک است.
              </p>
            </>
          )}
        </div>

        {saleType === "series" ? (
          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium">
              تعداد سری موجود در انبار
            </label>
            <input
              type="number"
              min="0"
              disabled={configuredGroups.length === 0}
              value={configuredGroups[0]?.stock || "0"}
              onChange={(event) => {
                const stock = event.target.value;
                onChange(
                  groups.map((group) =>
                    group.colorHex ? { ...group, stock } : group,
                  ),
                );
              }}
              className="w-full max-w-xs rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black disabled:opacity-40"
            />
            <p className="mt-1 text-xs text-neutral-500">
              چند سری کامل (همه رنگ‌ها با همین سایزها) در انبار دارید.
            </p>
          </div>
        ) : null}

        <p className="mb-2 mt-5 text-xs font-medium">
          {saleType === "series"
            ? "۲. سایزهای سری (یک‌بار برای همه رنگ‌ها)"
            : `۲. ترکیب پک ${activeGroup?.colorName || "رنگ انتخاب‌شده"} (S تا 5XL، یک یا دو عدد)`}
        </p>
        <div
          className={`flex flex-wrap items-start gap-x-1 gap-y-1 ${
            saleType === "series"
              ? configuredGroups.length
                ? ""
                : "pointer-events-none opacity-40"
              : colorReady
                ? ""
                : "pointer-events-none opacity-40"
          }`}
        >
          {SIZE_CHECKBOXES.map(({ size, slot, key }) => (
            <label
              key={key}
              className="flex w-8 cursor-pointer flex-col items-center gap-0.5 text-[10px] leading-tight"
            >
              <input
                type="checkbox"
                disabled={
                  saleType === "series"
                    ? configuredGroups.length === 0
                    : !colorReady
                }
                checked={Boolean(
                  saleType === "series"
                    ? seriesSlots[key]
                    : activeGroup?.slots[key],
                )}
                onChange={() => toggleSlot(key)}
                className="h-4 w-4 appearance-none rounded-full border border-neutral-500 bg-white checked:border-black checked:bg-black focus:outline-none focus:ring-1 focus:ring-black/30"
              />
              <span>
                {size}
                <span className="text-neutral-400"> {slot === 1 ? "۱" : "۲"}</span>
              </span>
            </label>
          ))}
        </div>

        {saleType === "selective" &&
          colorReady &&
          slotCountOf(activeGroup?.slots || {}) > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium">موجودی جدا برای فروش انتخابی</p>
            <p className="text-xs text-neutral-500">
              این عددها از موجودی پک سری جداست. فروش انتخابی از پک سری قرض نمی‌گیرد.
            </p>
            {SIZE_CHECKBOXES.filter(({ key }) => activeGroup?.slots[key]).map(
              ({ size, slot, key }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="w-16 text-xs text-neutral-600">
                    {size}
                    {slot === 2 ? " ۲" : ""}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={activeGroup?.slotStocks?.[key] || "0"}
                    onChange={(event) => {
                      if (!activeGroup) {
                        return;
                      }

                      updateGroup(activeGroup.id, {
                        slotStocks: {
                          ...activeGroup.slotStocks,
                          [key]: event.target.value,
                        },
                      });
                    }}
                    className="w-28 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              ),
            )}
          </div>
        )}
        {saleType === "selective" && !colorReady && (
          <p className="mt-2 text-xs text-neutral-500">
            اول یک رنگ از پالت بزنید تا چک‌باکس سایزها باز شود.
          </p>
        )}
        {saleType === "series" && configuredGroups.length === 0 && (
          <p className="mt-2 text-xs text-neutral-500">
            اول رنگ‌های سری را از پالت انتخاب کنید تا چک‌باکس سایزها باز شود.
          </p>
        )}
      </div>
    </div>
  );
}
