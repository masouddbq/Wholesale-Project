"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getAdminOrders, type AdminOrder } from "@/services/orderService";

const statusOptions = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "pending", label: "در انتظار بررسی" },
  { value: "confirmed", label: "تأیید شده" },
  { value: "preparing", label: "در حال آماده‌سازی" },
  { value: "shipped", label: "ارسال شده" },
  { value: "completed", label: "تکمیل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminOrders({
        page,
        limit: 20,
        search: search.trim(),
        status,
        sort,
      });

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch {
      setError("دریافت سفارش‌ها با مشکل مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, status, sort]);

  const handleSearch = () => {
    setPage(1);
    loadOrders();
  };

  const handleStatusChange = (value: string) => {
    setPage(1);
    setStatus(value);
  };

  const handleSortChange = (value: "newest" | "oldest") => {
    setPage(1);
    setSort(value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusLabel = (orderStatus: AdminOrder["status"]) => {
    const labels = {
      pending: "در انتظار بررسی",
      confirmed: "تأیید شده",
      preparing: "در حال آماده‌سازی",
      shipped: "ارسال شده",
      completed: "تکمیل شده",
      cancelled: "لغو شده",
    };

    return labels[orderStatus];
  };

  const getStatusClass = (orderStatus: AdminOrder["status"]) => {
    const classes = {
      pending: "bg-amber-100 text-amber-700",
      confirmed: "bg-blue-100 text-blue-700",
      preparing: "bg-purple-100 text-purple-700",
      shipped: "bg-indigo-100 text-indigo-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-neutral-100 text-neutral-600",
    };

    return classes[orderStatus];
  };

  const getPaymentStatusLabel = (
    paymentStatus: AdminOrder["paymentStatus"],
  ) => {
    return paymentStatus === "paid" ? "پرداخت شده" : "پرداخت نشده";
  };

  return (
    <div>
      {/* Header */}

      <div>
        <p className="text-sm text-neutral-500">مدیریت فروشگاه</p>

        <h1 className="mt-2 text-3xl font-bold">سفارش‌ها</h1>

        <p className="mt-2 text-sm text-neutral-500">
          مشاهده و مدیریت سفارش‌های مشتریان
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-700">
          {error}
        </div>
      )}

      {/* Filters */}

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px_auto]">
          {/* Search */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              جستجوی سفارش
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="شماره سفارش، نام یا موبایل..."
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                جستجو
              </button>
            </div>
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium">وضعیت</label>

            <select
              value={status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-1 text-sm outline-none focus:border-black"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}

          <div>
            <label className="mb-2 block text-sm font-medium">مرتب‌سازی</label>

            <select
              value={sort}
              onChange={(event) =>
                handleSortChange(event.target.value as "newest" | "oldest")
              }
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-1 text-sm outline-none focus:border-black"
            >
              <option value="newest">جدیدترین</option>

              <option value="oldest">قدیمی‌ترین</option>
            </select>
          </div>

          {/* Reset */}

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
                setSort("newest");
                setPage(1);
              }}
              className="w-full rounded-xl border border-neutral-300 px-5 py-5 text-sm font-medium transition hover:bg-neutral-50"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      </div>

      {/* Result Count */}

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {isLoading
            ? "در حال دریافت..."
            : `${pagination.total.toLocaleString("fa-IR")} سفارش`}
        </p>
      </div>

      {/* Orders */}

      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-neutral-500">
            در حال دریافت سفارش‌ها...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral-500">
            سفارشی با این مشخصات پیدا نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-right">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold">
                    شماره سفارش
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">مشتری</th>

                  <th className="px-5 py-4 text-sm font-semibold">مبلغ</th>

                  <th className="px-5 py-4 text-sm font-semibold">وضعیت</th>

                  <th className="px-5 py-4 text-sm font-semibold">پرداخت</th>

                  <th className="px-5 py-4 text-sm font-semibold">تاریخ</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-block text-sm font-semibold transition hover:underline"
                      >
                        <span dir="ltr">{order.orderNumber}</span>
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium">
                          {order.customer.name}
                        </p>

                        <p dir="ltr" className="mt-1 text-xs text-neutral-500">
                          {order.customer.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium">
                        {formatPrice(order.totalAmount)}
                      </span>

                      <span className="mr-1 text-xs text-neutral-500">
                        تومان
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-neutral-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}

      {!isLoading && pagination.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            قبلی
          </button>

          <div className="rounded-xl bg-black px-4 py-2.5 text-sm text-white">
            صفحه {page.toLocaleString("fa-IR")} از{" "}
            {pagination.totalPages.toLocaleString("fa-IR")}
          </div>

          <button
            type="button"
            disabled={page === pagination.totalPages}
            onClick={() =>
              setPage((current) => Math.min(current + 1, pagination.totalPages))
            }
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
