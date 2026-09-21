"use client";

import { useEffect, useState } from "react";

import {
  getDashboardStats,
  type DashboardStats,
} from "@/services/adminService";

// تغییر جدید: داشبورد ادمین با تم جدید
export default function AdminPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();

        setStats(data.stats);
      } catch {
        setError(
          "دریافت اطلاعات داشبورد با مشکل مواجه شد."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statItems = [
    {
      title: "کل سفارش‌ها",
      value: stats?.totalOrders,
    },
    {
      title: "سفارش‌های در انتظار",
      value: stats?.pendingOrders,
    },
    {
      title: "محصولات فعال",
      value: stats?.totalProducts,
    },
    {
      title: "کاربران",
      value: stats?.totalUsers,
    },
  ];

  return (
    <div>
      <div>
        <p className="text-sm text-neutral-500">
          مدیریت فروشگاه
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          داشبورد
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          نمای کلی وضعیت فروشگاه و سفارش‌ها
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 gold-shimmer-border"
          >
            <p className="text-sm text-neutral-500">
              {item.title}
            </p>

            <p className="mt-3 text-3xl font-bold">
              {isLoading ? "..." : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-bold">
          وضعیت فروشگاه
        </h2>

        <p className="mt-2 text-sm leading-7 text-neutral-500">
          اطلاعات این داشبورد مستقیماً از دیتابیس فروشگاه
          دریافت می‌شود.
        </p>
      </div>
    </div>
  );
}