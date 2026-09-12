"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import useCartStore from "@/store/cartStore";
import { createOrder } from "@/services/orderService";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setErrorMessage("");
  setIsSubmitting(true);

  try {
    const payload = {
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        province: province.trim(),
        city: city.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
      },

      items: items.map((item) => ({
        product: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),

      note: note.trim(),
    };

    const data = await createOrder(payload);

    console.log("Order created:", data);
  } catch (error: any) {
    console.error("Create order failed:", error);

    setErrorMessage(
      error?.response?.data?.message ||
        "ثبت سفارش با خطا مواجه شد."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-6 text-3xl font-bold">سبد خرید شما خالی است</h1>

          <p className="mt-4 text-neutral-500">
            برای ثبت سفارش ابتدا محصولی به سبد خرید اضافه کنید.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
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
        <p className="text-sm text-neutral-500">فروش عمده پوشاک</p>

        <h1 className="mt-2 text-4xl font-bold">ثبت سفارش</h1>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-500">
          اطلاعات خود را وارد کنید تا سفارش شما ثبت شود.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-8"
        >
          <h2 className="text-xl font-bold">اطلاعات مشتری</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                نام و نام خانوادگی
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                placeholder="مثلاً علی محمدی"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 outline-none transition focus:border-black"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                شماره موبایل
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                placeholder="مثلاً 09121234567"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-left outline-none transition focus:border-black"
                dir="ltr"
              />
            </div>

            {/* Province */}
            <div>
              <label
                htmlFor="province"
                className="mb-2 block text-sm font-medium"
              >
                استان
              </label>

              <input
                id="province"
                type="text"
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                required
                placeholder="مثلاً خراسان رضوی"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 outline-none transition focus:border-black"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium">
                شهر
              </label>

              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
                placeholder="مثلاً مشهد"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 outline-none transition focus:border-black"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label
                htmlFor="postalCode"
                className="mb-2 block text-sm font-medium"
              >
                کد پستی
              </label>

              <input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="۱۰ رقم"
                maxLength={10}
                dir="ltr"
                className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-left outline-none transition focus:border-black"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-5">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              آدرس
            </label>

            <textarea
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              minLength={10}
              rows={4}
              placeholder="آدرس کامل محل تحویل سفارش..."
              className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* Note */}
          <div className="mt-5">
            <label htmlFor="note" className="mb-2 block text-sm font-medium">
              توضیحات سفارش
              <span className="mr-2 text-xs font-normal text-neutral-400">
                اختیاری
              </span>
            </label>

            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="اگر توضیح خاصی درباره سفارش دارید..."
              className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

        {errorMessage && (
  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {errorMessage}
  </div>
)}

<button
  type="submit"
  disabled={isSubmitting}
  className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isSubmitting ? "در حال ثبت سفارش..." : "ثبت سفارش"}
</button>
        </form>

        {/* Order Summary */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-neutral-50 p-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">خلاصه سفارش</h2>

            <Link
              href="/cart"
              className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black"
            >
              ویرایش سبد
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-3"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                  {item.image && (
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {item.size} / {item.color}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    تعداد: {item.quantity.toLocaleString("fa-IR")}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 border-t border-neutral-200 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">تعداد کالا</span>

              <span className="font-medium">
                {totalItems.toLocaleString("fa-IR")} عدد
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold">مبلغ کل</span>

              <span className="text-lg font-bold">
                {totalAmount.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
