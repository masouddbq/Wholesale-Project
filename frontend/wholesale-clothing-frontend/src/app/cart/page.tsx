"use client";

import Link from "next/link";
import useCartStore from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-6 text-3xl font-bold">سبد خرید خالی است</h1>

          <p className="mt-4 text-neutral-500">
            هنوز محصولی به سبد خرید اضافه نکرده‌اید.
          </p>

          <Link
            href="/products"
            className="btn-primary-glow mt-8 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-neutral-500">خرید عمده پوشاک</p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">سبد خرید</h1>

            <p className="mt-3 text-neutral-500">
              {totalItems.toLocaleString("fa-IR")} عدد محصول در سبد خرید شماست.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-neutral-600 transition hover:text-black"
          >
            خالی کردن سبد
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const itemTotal = item.price * item.quantity;

            return (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:h-36 md:w-36"
                  >
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
                  </Link>

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-semibold transition hover:underline"
                        >
                          {item.name}
                        </Link>

                        <p className="mt-2 text-sm text-neutral-500">
                          سایز: {item.size}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          رنگ: {item.color}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          SKU: {item.sku}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="text-sm text-neutral-600 transition hover:text-black"
                      >
                        حذف
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                      {/* Quantity */}
                      <div>
                        <p className="mb-2 text-xs text-neutral-500">تعداد</p>

                        <div className="flex w-fit items-center overflow-hidden rounded-lg border border-neutral-300">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity - 1,
                              )
                            }
                            disabled={
                              item.quantity <= item.minimumOrderQuantity
                            }
                            className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="flex h-10 min-w-12 items-center justify-center border-x border-neutral-300 px-2 text-sm font-semibold">
                            {item.quantity.toLocaleString("fa-IR")}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity + 1,
                              )
                            }
                            disabled={item.quantity >= item.stock}
                            className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-left">
                        <p className="text-xs text-neutral-500">قیمت کل</p>

                        <p className="mt-1 font-bold">
                          {itemTotal.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-neutral-50 p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-bold">خلاصه سفارش</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">تعداد کالا</span>

              <span className="font-medium">
                {totalItems.toLocaleString("fa-IR")} عدد
              </span>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">مبلغ کل</span>

                <span className="text-lg font-bold">
                  {totalAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="btn-primary-glow mt-6 block w-full rounded-xl bg-black px-6 py-4 text-center font-semibold text-white transition hover:bg-neutral-800"
          >
            ادامه ثبت سفارش
          </Link>

          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-neutral-600 transition hover:text-black"
          >
            ادامه خرید
          </Link>
        </aside>
      </div>
    </div>
  );
}
