"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orderService";

type Order = {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: {
    product: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
};

const statusLabels: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

const paymentStatusLabels: Record<string, string> = {
  unpaid: "پرداخت نشده",
  paid: "پرداخت شده",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError(false);

        const data = await getMyOrders();

        setOrders(data.orders || []);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />

          <p className="mt-4 text-sm text-neutral-500">
            در حال دریافت سفارش‌ها...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">
            ورود به حساب کاربری
          </h1>

          <p className="mt-4 leading-7 text-neutral-500">
            برای مشاهده سفارش‌های خود ابتدا وارد حساب
            کاربری شوید.
          </p>

          <Link
            href="/login"
            className="mt-6 block rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            ورود به حساب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <p className="text-sm text-neutral-500">
          حساب کاربری
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          سفارش‌های من
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-500">
          در این بخش می‌توانید سفارش‌های ثبت‌شده خود را
          مشاهده و وضعیت آن‌ها را پیگیری کنید.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-20 text-center">
          <h2 className="text-xl font-semibold">
            هنوز سفارشی ثبت نکرده‌اید
          </h2>

          <p className="mt-3 text-neutral-500">
            برای شروع، محصولات موردنظر خود را انتخاب کنید.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-sm md:p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-neutral-500">
                    شماره سفارش
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 font-bold tracking-wide"
                  >
                    {order.orderNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    تاریخ ثبت
                  </p>

                  <p className="mt-1 font-medium">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("fa-IR")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    تعداد اقلام
                  </p>

                  <p className="mt-1 font-medium">
                    {order.items.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )}{" "}
                    عدد
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    مبلغ کل
                  </p>

                  <p className="mt-1 font-bold">
                    {order.totalAmount.toLocaleString(
                      "fa-IR"
                    )}{" "}
                    تومان
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm">
                    {statusLabels[order.status] ||
                      order.status}
                  </span>

                  <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm">
                    {paymentStatusLabels[
                      order.paymentStatus
                    ] || order.paymentStatus}
                  </span>
                </div>

                <Link
                  href={`/account/orders/${order._id}`}
                  className="rounded-xl border border-neutral-300 px-5 py-2.5 text-center text-sm font-medium transition hover:bg-neutral-50"
                >
                  مشاهده جزئیات
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
