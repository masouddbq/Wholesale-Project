"use client";

import useAuthStore from "@/store/authStore";
import {
  AVAILABILITY_OPTIONS,
  type AvailabilityStatus,
} from "@/lib/availability";
import { canSeeExactStock } from "@/lib/roles";

type StockStatusBadgeProps = {
  status?: AvailabilityStatus;
  stockCount?: number;
  className?: string;
};

export default function StockStatusBadge({
  status = "in_stock",
  stockCount = 0,
  className = "",
}: StockStatusBadgeProps) {
  const role = useAuthStore((state) => state.user?.role);
  const exact = canSeeExactStock(role);

  if (exact) {
    return (
      <span
        className={`inline-flex rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700 ${className}`}
      >
        موجودی: {stockCount.toLocaleString("fa-IR")} عدد
      </span>
    );
  }

  const styles: Record<AvailabilityStatus, string> = {
    in_stock: "border-emerald-200 bg-emerald-50 text-emerald-800",
    out_of_stock: "border-neutral-200 bg-neutral-100 text-neutral-500",
    limited: "border-amber-200 bg-amber-50 text-amber-800",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${styles[status]} ${className}`}
    >
      {AVAILABILITY_OPTIONS.find((item) => item.value === status)?.label}
    </span>
  );
}
