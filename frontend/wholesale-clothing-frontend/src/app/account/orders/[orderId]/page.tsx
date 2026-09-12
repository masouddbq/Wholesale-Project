import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/services/orderService";

type OrderItem = {
  product: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  sku?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  note?: string;
  createdAt: string;
};

type OrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
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

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;

  let order: Order;

  try {
    const data = await getOrderById(orderId);

    order = data.order || data;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/account/orders"
          className="text-sm text-neutral-500 underline underline-offset-4 transition hover:text-black"
        >
          بازگشت به سفارش‌های من
        </Link>

        <div className="mt-6">
          <p className="text-sm text-neutral-500">
            جزئیات سفارش
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            سفارش{" "}
            <span dir="ltr">
              {order.orderNumber}
            </span>
          </h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6">
            <div className="flex flex-col gap-4 border-b border-neutral-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-500">
                  وضعیت سفارش
                </p>

                <p className="mt-1 font-semibold">
                  {statusLabels[order.status] ||
                    order.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">
                  وضعیت پرداخت
                </p>

                <p className="mt-1 font-semibold">
                  {paymentStatusLabels[
                    order.paymentStatus
                  ] || order.paymentStatus}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">
                  تاریخ ثبت
                </p>

                <p className="mt-1 font-semibold">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item, index) => (
                <div
                  key={`${item.product}-${item.sku}-${index}`}
                  className="flex gap-4 py-5"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {item.image ? (
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                        بدون تصویر
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                      {item.name}
                    </h2>

                    <div className="mt-2 space-y-1 text-sm text-neutral-500">
                      {item.size && (
                        <p>سایز: {item.size}</p>
                      )}

                      {item.color && (
                        <p>رنگ: {item.color}</p>
                      )}

                      {item.sku && (
                        <p dir="ltr">
                          SKU: {item.sku}
                        </p>
                      )}

                      <p>
                        تعداد: {item.quantity} عدد
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-left">
                    <p className="text-sm text-neutral-500">
                      قیمت واحد
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {item.price.toLocaleString(
                        "fa-IR"
                      )}{" "}
                      تومان
                    </p>

                    <p className="mt-3 font-bold">
                      {(
                        item.price * item.quantity
                      ).toLocaleString("fa-IR")}{" "}
                      تومان
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {order.note && (
            <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 md:p-6">
              <h2 className="font-semibold">
                توضیحات سفارش
              </h2>

              <p className="mt-3 leading-7 text-neutral-600">
                {order.note}
              </p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold">
              اطلاعات گیرنده
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-neutral-500">
                  نام
                </p>

                <p className="mt-1 font-medium">
                  {order.customer.name}
                </p>
              </div>

              <div>
                <p className="text-neutral-500">
                  شماره تماس
                </p>

                <p
                  dir="ltr"
                  className="mt-1 font-medium text-right"
                >
                  {order.customer.phone}
                </p>
              </div>

              <div>
                <p className="text-neutral-500">
                  آدرس
                </p>

                <p className="mt-1 leading-7">
                  {order.customer.province}،{" "}
                  {order.customer.city}
                  <br />
                  {order.customer.address}
                </p>
              </div>

              {order.customer.postalCode && (
                <div>
                  <p className="text-neutral-500">
                    کد پستی
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 font-medium text-right"
                  >
                    {order.customer.postalCode}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-black p-6 text-white">
            <p className="text-sm text-neutral-400">
              مبلغ نهایی سفارش
            </p>

            <p className="mt-2 text-2xl font-bold">
              {order.totalAmount.toLocaleString(
                "fa-IR"
              )}{" "}
              تومان
            </p>

            <Link
              href="/account/orders"
              className="mt-6 block rounded-xl bg-white px-5 py-3 text-center font-medium text-black transition hover:bg-neutral-100"
            >
              بازگشت به سفارش‌ها
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}