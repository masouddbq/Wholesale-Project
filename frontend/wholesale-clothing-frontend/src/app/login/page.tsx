"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/authService";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await login(phone, password);

      setUser(data.user);

      router.push("/account/orders");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "شماره موبایل یا رمز عبور اشتباه است."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[700px] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm text-neutral-500">
            حساب کاربری
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            ورود به حساب
          </h1>

          <p className="mt-4 text-sm leading-7 text-neutral-500">
            برای مشاهده سفارش‌ها و مدیریت حساب کاربری
            خود وارد شوید.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                  setPhone(event.target.value)
                }
                placeholder="09123456789"
                autoComplete="tel"
                required
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                رمز عبور
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="رمز عبور خود را وارد کنید"
                autoComplete="current-password"
                required
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-glow h-12 w-full rounded-xl bg-black font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "در حال ورود..."
                : "ورود به حساب"}
            </button>
          </form>

          <div className="mt-6 border-t border-neutral-100 pt-6 text-center text-sm">
            <span className="text-neutral-500">
              حساب کاربری ندارید؟
            </span>{" "}
            <Link
              href="/register"
              className="font-medium underline underline-offset-4"
            >
              ثبت‌نام کنید
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-neutral-500 underline underline-offset-4 transition hover:text-black"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}