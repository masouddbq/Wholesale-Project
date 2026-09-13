"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/appClient";
import { getMe } from "@/services/authService";

type Address = {
  _id: string;
  title: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
};

type AddressForm = {
  title: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

const emptyForm: AddressForm = {
  title: "",
  province: "",
  city: "",
  address: "",
  postalCode: "",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [form, setForm] = useState<AddressForm>(emptyForm);

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setError("");

        const data = await getMe();

        setAddresses(data.user.addresses || []);
      } catch {
        setError("دریافت آدرس‌ها با مشکل مواجه شد.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingAddressId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.title.trim() ||
      !form.province.trim() ||
      !form.city.trim() ||
      !form.address.trim()
    ) {
      setError("لطفاً تمام فیلدهای الزامی را تکمیل کنید.");
      return;
    }

    try {
      setIsSaving(true);

      if (editingAddressId) {
        await apiClient.patch(`/users/me/addresses/${editingAddressId}`, {
          title: form.title.trim(),
          province: form.province.trim(),
          city: form.city.trim(),
          address: form.address.trim(),
          postalCode: form.postalCode.trim(),
        });

        const data = await getMe();

        setAddresses(data.user.addresses || []);

        setSuccess("آدرس با موفقیت ویرایش شد.");
      } else {
        await apiClient.post("/users/me/addresses", {
          title: form.title.trim(),
          province: form.province.trim(),
          city: form.city.trim(),
          address: form.address.trim(),
          postalCode: form.postalCode.trim(),
        });

        const data = await getMe();

        setAddresses(data.user.addresses || []);

        setSuccess("آدرس جدید با موفقیت اضافه شد.");
      }

      resetForm();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "عملیات روی آدرس با مشکل مواجه شد.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddressId(address._id);

    setForm({
      title: address.title,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (addressId: string) => {
    const confirmed = window.confirm(
      "آیا از حذف این آدرس مطمئن هستید؟",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiClient.delete(`/users/me/addresses/${addressId}`);

      const data = await getMe();

      setAddresses(data.user.addresses || []);

      if (editingAddressId === addressId) {
        resetForm();
      }

      setSuccess("آدرس با موفقیت حذف شد.");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "حذف آدرس با مشکل مواجه شد.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />

          <p className="mt-4 text-sm text-neutral-500">
            در حال دریافت آدرس‌ها...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Header */}

      <div className="mb-10">
        <p className="text-sm text-neutral-500">
          حساب کاربری
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          آدرس‌های من
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-500">
          آدرس‌های خود را مدیریت کنید تا هنگام ثبت سفارش سریع‌تر
          آن‌ها را انتخاب کنید.
        </p>
      </div>

      <div className="space-y-6">
        {/* Form */}

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold">
              {editingAddressId
                ? "ویرایش آدرس"
                : "افزودن آدرس جدید"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              اطلاعات آدرس را وارد کنید.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid max-w-3xl gap-5 md:grid-cols-2"
          >
            {/* Title */}

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                عنوان آدرس
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="مثلاً منزل"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
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
                name="province"
                type="text"
                value={form.province}
                onChange={handleChange}
                placeholder="مثلاً خراسان رضوی"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* City */}

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium"
              >
                شهر
              </label>

              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="مثلاً مشهد"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
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
                name="postalCode"
                type="text"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="کد پستی"
                dir="ltr"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* Address */}

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium"
              >
                آدرس کامل
              </label>

              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                placeholder="آدرس کامل خود را وارد کنید"
                className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 leading-7 outline-none transition focus:border-black"
              />
            </div>

            {/* Messages */}

            {(error || success) && (
              <div className="md:col-span-2">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-600">
                    {success}
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "در حال ذخیره..."
                  : editingAddressId
                    ? "ذخیره تغییرات"
                    : "افزودن آدرس"}
              </button>

              {editingAddressId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-neutral-300 px-6 py-3 font-medium transition hover:bg-neutral-50"
                >
                  انصراف
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Address List */}

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              آدرس‌های ذخیره‌شده
            </h2>
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold">
                هنوز آدرسی ثبت نکرده‌اید
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                از فرم بالا اولین آدرس خود را اضافه کنید.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="rounded-2xl border border-neutral-200 p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-bold">
                        {address.title}
                      </h3>

                      <p className="mt-3 leading-7 text-neutral-600">
                        {address.province}، {address.city}
                      </p>

                      <p className="leading-7 text-neutral-600">
                        {address.address}
                      </p>

                      {address.postalCode && (
                        <p
                          dir="ltr"
                          className="mt-2 text-sm text-neutral-500"
                        >
                          {address.postalCode}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(address)}
                        className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
                      >
                        ویرایش
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(address._id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
