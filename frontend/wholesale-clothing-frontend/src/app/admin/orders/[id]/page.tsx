"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  getAdminOrderById,
  updateAdminOrderStatus,
  type AdminOrderDetail,
  type OrderStatus,
} from "@/services/orderService";

export default function AdminOrderDetailPage() {
  const params = useParams();

  const orderId = params.id as string;

  const [order, setOrder] =
    useState<AdminOrderDetail | null>(null);

    const [selectedStatus, setSelectedStatus] =
  useState<OrderStatus>("pending");

const [isUpdatingStatus, setIsUpdatingStatus] =
  useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data =
          await getAdminOrderById(orderId);

        setOrder(data);
        setSelectedStatus(data.status);
      } catch {
        setError(
          "دریافت جزئیات سفارش با مشکل مواجه شد."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(
      price
    );
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

  const getStatusLabel = (
    status: AdminOrderDetail["status"]
  ) => {
    const labels = {
      pending: "در انتظار بررسی",
      confirmed: "تأیید شده",
      preparing: "در حال آماده‌سازی",
      shipped: "ارسال شده",
      completed: "تکمیل شده",
      cancelled: "لغو شده",
    };

    return labels[status];
  };

  const getStatusClass = (
    status: AdminOrderDetail["status"]
  ) => {
    const classes = {
      pending:
        "bg-amber-100 text-amber-700",
      confirmed:
        "bg-blue-100 text-blue-700",
      preparing:
        "bg-purple-100 text-purple-700",
      shipped:
        "bg-indigo-100 text-indigo-700",
      completed:
        "bg-green-100 text-green-700",
      cancelled:
        "bg-neutral-100 text-neutral-600",
    };

    return classes[status];
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />

          <p className="mt-4 text-sm text-neutral-500">
            در حال دریافت سفارش...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Link
          href="/admin/orders"
          className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black"
        >
          بازگشت به سفارش‌ها
        </Link>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-700">
          {error || "سفارش پیدا نشد."}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}

      <div>
        <Link
          href="/admin/orders"
          className="text-sm text-neutral-500 transition hover:text-black"
        >
          ← بازگشت به سفارش‌ها
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-neutral-500">
              جزئیات سفارش
            </p>

            <h1
              dir="ltr"
              className="mt-2 text-3xl font-bold"
            >
              {order.orderNumber}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              ثبت شده در{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
              order.status
            )}`}
          >
            {getStatusLabel(order.status)}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
  <h2 className="mb-4 text-lg font-semibold">
    تغییر وضعیت سفارش
  </h2>

  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    <select
      value={selectedStatus}
      onChange={(e) =>
        setSelectedStatus(e.target.value as OrderStatus)
      }
      disabled={isUpdatingStatus}
      className="rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-black"
    >
      <option value="pending">در انتظار</option>
      <option value="confirmed">تأیید شده</option>
      <option value="preparing">در حال آماده‌سازی</option>
      <option value="shipped">ارسال شده</option>
      <option value="completed">تکمیل شده</option>
      <option value="cancelled">لغو شده</option>
    </select>

    <button
      type="button"
      disabled={isUpdatingStatus || selectedStatus === order.status}
      onClick={async () => {
        try {
          setIsUpdatingStatus(true);

          await updateAdminOrderStatus(
            order._id,
            selectedStatus
          );

          const updatedOrder =
            await getAdminOrderById(order._id);

          setOrder(updatedOrder);
          setSelectedStatus(updatedOrder.status);
        } catch (error) {
          console.error(error);
          alert("تغییر وضعیت سفارش با مشکل مواجه شد.");
        } finally {
          setIsUpdatingStatus(false);
        }
      }}
      className="btn-primary-glow rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isUpdatingStatus ? "در حال ذخیره..." : "ذخیره وضعیت"}
    </button>
  </div>
</div>

      {/* Customer + Address */}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">
            اطلاعات مشتری
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-neutral-500">
                نام مشتری
              </p>

              <p className="mt-1 text-sm font-medium">
                {order.customer.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">
                شماره تماس
              </p>

              <p
                dir="ltr"
                className="mt-1 text-sm font-medium"
              >
                {order.customer.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">
            آدرس ارسال
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <p>
              <span className="text-neutral-500">
                استان:
              </span>{" "}
              {order.customer.province}
            </p>

            <p>
              <span className="text-neutral-500">
                شهر:
              </span>{" "}
              {order.customer.city}
            </p>

            <p className="leading-7">
              <span className="text-neutral-500">
                آدرس:
              </span>{" "}
              {order.customer.address}
            </p>

            {order.customer.postalCode && (
              <p>
                <span className="text-neutral-500">
                  کد پستی:
                </span>{" "}
                <span dir="ltr">
                  {order.customer.postalCode}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-lg font-bold">
            محصولات سفارش
          </h2>
        </div>

        <div className="divide-y divide-neutral-100">
          {order.items.map((item, index) => (
            <div
              key={`${item.product}-${index}`}
              className="flex flex-col gap-5 p-6 md:flex-row md:items-center"
            >
              {/* Image */}

              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {item.image ? (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    بدون تصویر
                  </div>
                )}
              </div>

              {/* Product info */}

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-500">
                  {item.size && (
                    <span>
                      سایز: {item.size}
                    </span>
                  )}

                  {item.color && (
                    <span>
                      رنگ: {item.color}
                    </span>
                  )}

                  {item.sku && (
                    <span dir="ltr">
                      SKU: {item.sku}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity */}

              <div className="text-sm">
                <span className="text-neutral-500">
                  تعداد:
                </span>{" "}
                <span className="font-medium">
                  {item.quantity.toLocaleString(
                    "fa-IR"
                  )}
                </span>
              </div>

              {/* Price */}

              <div className="text-left">
                <p className="text-sm font-semibold">
                  {formatPrice(
                    item.price * item.quantity
                  )}{" "}
                  تومان
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  {formatPrice(item.price)} تومان ×{" "}
                  {item.quantity.toLocaleString(
                    "fa-IR"
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}

        <div className="border-t border-neutral-200 bg-neutral-50 p-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              مبلغ کل سفارش
            </span>

            <span className="text-xl font-bold">
              {formatPrice(order.totalAmount)}{" "}
              تومان
            </span>
          </div>
        </div>
      </div>

      {/* Payment + Note */}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold">
            وضعیت پرداخت
          </h2>

          <div className="mt-5">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                order.paymentStatus === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {order.paymentStatus === "paid"
                ? "پرداخت شده"
                : "پرداخت نشده"}
            </span>
          </div>
        </div>

        {order.note && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-bold">
              یادداشت مشتری
            </h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-600">
              {order.note}
            </p>
          </div>
        )}
      </div>

      {/* Status History */}

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-bold">
          تاریخچه وضعیت سفارش
        </h2>

        {order.statusHistory.length === 0 ? (
          <p className="mt-5 text-sm text-neutral-500">
            تاریخچه‌ای برای این سفارش ثبت نشده است.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {order.statusHistory.map(
              (history) => (
                <div
                  key={history._id}
                  className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <span className="font-medium">
                      {getStatusLabel(
                        history.status
                      )}
                    </span>

                    {history.previousStatus && (
                      <span className="mr-2 text-sm text-neutral-500">
                        ← از{" "}
                        {getStatusLabel(
                          history.previousStatus
                        )}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-neutral-500">
                    {formatDate(history.changedAt)}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}