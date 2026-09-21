"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import useCartStore from "@/store/cartStore";
import { createOrder } from "@/services/orderService";
import { getMe } from "@/services/authService";
import { useToast } from "@/components/Toast";

type Address = {
  _id: string;
  title: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
};

type User = {
  id: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
  addresses?: Address[];
};

export default function CheckoutPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const items = useCartStore(
    (state) => state.items
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const hasHydrated = useCartStore(
    (state) => state.hasHydrated
  );

  const [isCheckingCart, setIsCheckingCart] =
    useState(true);

  const [isOrderCompleted, setIsOrderCompleted] =
    useState(false);

  const [user, setUser] =
    useState<User | null>(null);

  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [isLoadingUser, setIsLoadingUser] =
    useState(true);

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const [isNewAddress, setIsNewAddress] =
    useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  /*
   * بررسی سبد خرید
   */
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isOrderCompleted) {
      return;
    }

    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    setIsCheckingCart(false);
  }, [
    hasHydrated,
    items.length,
    router,
    isOrderCompleted,
  ]);

  /*
   * دریافت اطلاعات کاربر
   *
   * اگر کاربر مهمان باشد، getMe خطا می‌دهد
   * و user همان null باقی می‌ماند.
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getMe();

        const currentUser = data.user as User;

        setUser(currentUser);

        setName(currentUser.name || "");
        setPhone(currentUser.phone || "");

        const userAddresses =
          currentUser.addresses || [];

        setAddresses(userAddresses);

        /*
         * اگر کاربر فقط یک آدرس داشته باشد،
         * همان ابتدا انتخابش می‌کنیم.
         */
        if (userAddresses.length === 1) {
          const firstAddress =
            userAddresses[0];

          setSelectedAddressId(
            firstAddress._id
          );

          setProvince(
            firstAddress.province || ""
          );

          setCity(
            firstAddress.city || ""
          );

          setAddress(
            firstAddress.address || ""
          );

          setPostalCode(
            firstAddress.postalCode || ""
          );
        }
      } catch {
        /*
         * کاربر مهمان است.
         */
        setUser(null);
        setAddresses([]);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  /*
   * انتخاب آدرس ذخیره‌شده
   */
  const handleSelectAddress = (
    selectedAddress: Address
  ) => {
    setSelectedAddressId(
      selectedAddress._id
    );

    setIsNewAddress(false);

    setProvince(
      selectedAddress.province || ""
    );

    setCity(
      selectedAddress.city || ""
    );

    setAddress(
      selectedAddress.address || ""
    );

    setPostalCode(
      selectedAddress.postalCode || ""
    );
  };

  /*
   * انتخاب آدرس جدید
   */
  const handleNewAddress = () => {
    setSelectedAddressId(null);
    setIsNewAddress(true);

    setProvince("");
    setCity("");
    setAddress("");
    setPostalCode("");
  };

  /*
   * نمایش لودینگ اولیه
   */
  if (
    isCheckingCart ||
    isLoadingUser
  ) {
    return (
      <div className="mx-auto flex min-h-[600px] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />

          <p className="mt-4 text-sm text-neutral-500">
            در حال آماده‌سازی ثبت سفارش...
          </p>
        </div>
      </div>
    );
  }

  const totalAmount = items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

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

      const data =
        await createOrder(payload);

      const orderNumber =
        data.order.orderNumber;

      if (!orderNumber) {
        throw new Error(
          "شماره سفارش از Backend دریافت نشد."
        );
      }

      setIsOrderCompleted(true);

      clearCart();

      addToast("سفارش شما با موفقیت ثبت شد", "success");

      router.push(
        `/order-success/${orderNumber}`
      );
    } catch (error: any) {
      console.error(
        "Create order failed:",
        error
      );

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "ثبت سفارش با خطا مواجه شد."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <p className="text-sm text-neutral-500">
          تکمیل سفارش
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          ثبت سفارش
        </h1>

        <p className="mt-4 text-neutral-500">
          اطلاعات خود را وارد کنید تا سفارش شما
          ثبت شود.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

        {/* اطلاعات مشتری */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8"
        >
          <h2 className="text-xl font-bold">
            اطلاعات مشتری
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* نام */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                نام و نام خانوادگی
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
              />
            </div>

            {/* شماره */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium"
              >
                شماره موبایل
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                required
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
              />
            </div>

            {/* آدرس‌های ذخیره‌شده */}
            {user &&
              addresses.length > 0 && (
                <div className="md:col-span-2">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        آدرس ارسال
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        یکی از آدرس‌های ذخیره‌شده را انتخاب کنید.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {addresses.map(
                      (savedAddress) => {
                        const isSelected =
                          selectedAddressId ===
                          savedAddress._id;

                        return (
                          <button
                            key={
                              savedAddress._id
                            }
                            type="button"
                            onClick={() =>
                              handleSelectAddress(
                                savedAddress
                              )
                            }
                            className={`w-full rounded-2xl border p-4 text-right transition ${
                              isSelected
                                ? "border-black bg-neutral-50"
                                : "border-neutral-200 hover:border-neutral-400"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                  isSelected
                                    ? "border-black"
                                    : "border-neutral-300"
                                }`}
                              >
                                {isSelected && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-black" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold">
                                  {
                                    savedAddress.title
                                  }
                                </p>

                                <p className="mt-1 text-sm text-neutral-500">
                                  {
                                    savedAddress.province
                                  }{" "}
                                  -{" "}
                                  {
                                    savedAddress.city
                                  }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-neutral-600">
                                  {
                                    savedAddress.address
                                  }
                                </p>

                                {savedAddress.postalCode && (
                                  <p className="mt-1 text-xs text-neutral-400">
                                    کد پستی:{" "}
                                    {
                                      savedAddress.postalCode
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )}

                    <button
                      type="button"
                      onClick={
                        handleNewAddress
                      }
                      className={`w-full rounded-2xl border border-dashed p-4 text-right transition ${
                        isNewAddress
                          ? "border-black bg-neutral-50"
                          : "border-neutral-300 hover:border-neutral-500"
                      }`}
                    >
                      <span className="font-semibold">
                        + استفاده از آدرس جدید
                      </span>

                      <p className="mt-1 text-sm text-neutral-500">
                        وارد کردن آدرس جدید برای این سفارش
                      </p>
                    </button>
                  </div>
                </div>
              )}

            {/* فرم آدرس */}
            {(!user ||
              addresses.length === 0 ||
              isNewAddress ||
              selectedAddressId) && (
              <>
                {/* استان */}
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
                    onChange={(event) =>
                      setProvince(
                        event.target.value
                      )
                    }
                    required
                    className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
                  />
                </div>

                {/* شهر */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium"
                  >
                    شهر
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                    required
                    className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
                  />
                </div>

                {/* کد پستی */}
                <div className="md:col-span-2">
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
                    onChange={(event) =>
                      setPostalCode(
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
                  />
                </div>

                {/* آدرس */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium"
                  >
                    آدرس
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    required
                    rows={4}
                    className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>
              </>
            )}

            {/* توضیحات */}
            <div className="md:col-span-2">
              <label
                htmlFor="note"
                className="mb-2 block text-sm font-medium"
              >
                توضیحات سفارش
              </label>

              <textarea
                id="note"
                value={note}
                onChange={(event) =>
                  setNote(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="اگر توضیح خاصی درباره سفارش دارید..."
                className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary-glow mt-8 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "در حال ثبت سفارش..."
              : "ثبت سفارش"}
          </button>
        </form>

        {/* خلاصه سفارش */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-neutral-50 p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-bold">
            خلاصه سفارش
          </h2>

          <div className="mt-6 space-y-5">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
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
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    {item.size} /{" "}
                    {item.color}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    تعداد:{" "}
                    {item.quantity.toLocaleString(
                      "fa-IR"
                    )}
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString(
                      "fa-IR"
                    )}{" "}
                    تومان
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-neutral-200 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">
                تعداد کالا
              </span>

              <span className="font-medium">
                {totalItems.toLocaleString(
                  "fa-IR"
                )}{" "}
                عدد
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-medium">
                مبلغ کل
              </span>

              <span className="text-xl font-bold">
                {totalAmount.toLocaleString(
                  "fa-IR"
                )}{" "}
                تومان
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
