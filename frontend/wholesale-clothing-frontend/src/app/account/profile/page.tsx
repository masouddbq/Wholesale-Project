"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/services/authService";
import apiClient from "@/lib/appClient";

type User = {
  _id: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");

        const data = await getMe();

        setUser(data.user);
        setName(data.user.name);
      } catch {
        setError(
          "دریافت اطلاعات حساب کاربری با مشکل مواجه شد."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("نام نمی‌تواند خالی باشد.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await apiClient.patch(
        "/users/me",
        {
          name: name.trim(),
        }
      );

      setUser(response.data.user);

      setSuccess(
        "اطلاعات پروفایل با موفقیت بروزرسانی شد."
      );
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "بروزرسانی اطلاعات با مشکل مواجه شد."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />

          <p className="mt-4 text-sm text-neutral-500">
            در حال دریافت اطلاعات حساب...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">
            ورود به حساب کاربری
          </h1>

          <p className="mt-4 leading-7 text-neutral-500">
            برای مشاهده پروفایل ابتدا وارد حساب کاربری شوید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="mb-10">
        <p className="text-sm text-neutral-500">
          حساب کاربری
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          پروفایل من
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-500">
          اطلاعات حساب کاربری خود را از این بخش مدیریت کنید.
        </p>
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold">
            اطلاعات شخصی
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            اطلاعات حساب کاربری خود را مشاهده و ویرایش کنید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl space-y-6"
        >
          {/* Name */}
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
                setName(event.target.value)
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="نام و نام خانوادگی"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium"
            >
              شماره موبایل
            </label>

            <input
              id="phone"
              type="text"
              value={user.phone}
              disabled
              dir="ltr"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-500 outline-none"
            />

            <p className="mt-2 text-xs text-neutral-400">
              شماره موبایل قابل ویرایش نیست.
            </p>
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium"
            >
              نوع حساب
            </label>

            <input
              id="role"
              type="text"
              value={
                user.role === "admin"
                  ? "مدیر"
                  : "مشتری"
              }
              disabled
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-500 outline-none"
            />
          </div>

          {/* Messages */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? "در حال ذخیره..."
              : "ذخیره تغییرات"}
          </button>
        </form>
      </section>
    </div>
  );
}
