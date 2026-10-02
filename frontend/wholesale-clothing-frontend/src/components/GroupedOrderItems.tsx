import { API_BASE } from "@/lib/imageUrl";
import {
  groupedPieceCount,
  groupedProductTotal,
  groupOrderItemsByProduct,
  type OrderDisplayItem,
} from "@/lib/cartGroups";
import CompactVariantSummary from "@/components/CompactVariantSummary";

type GroupedOrderItemsProps = {
  items: OrderDisplayItem[];
  showUnitPrice?: boolean;
};

export default function GroupedOrderItems({
  items,
  showUnitPrice = true,
}: GroupedOrderItemsProps) {
  const groups = groupOrderItemsByProduct(items);

  return (
    <div className="divide-y divide-neutral-100">
      {groups.map((group) => {
        const pieceCount = groupedPieceCount(group);
        const itemTotal = groupedProductTotal(group);

        return (
          <div
            key={group.productId}
            className="flex flex-col gap-5 py-5 md:flex-row md:items-start"
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              {group.image ? (
                <img
                  src={`${API_BASE}${group.image}`}
                  alt={group.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                  بدون تصویر
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">{group.name}</h2>

              <CompactVariantSummary colors={group.colors} className="mt-3" />

              <p className="mt-3 text-sm text-neutral-500">
                تعداد: {pieceCount.toLocaleString("fa-IR")} عدد
              </p>
            </div>

            <div className="shrink-0 text-left">
              {showUnitPrice && (
                <>
                  <p className="text-sm text-neutral-500">قیمت واحد</p>
                  <p className="mt-1 text-sm font-medium">
                    {group.price.toLocaleString("fa-IR")} تومان
                  </p>
                </>
              )}

              <p className={showUnitPrice ? "mt-3 font-bold" : "font-semibold"}>
                {itemTotal.toLocaleString("fa-IR")} تومان
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
