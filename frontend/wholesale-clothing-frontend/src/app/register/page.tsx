"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login, register } from "@/services/authService";
import useAuthStore from "@/store/authStore";
import { useToast } from "@/components/Toast";
import FormNotice from "@/components/FormNotice";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await register(name, phone, password);

      const data = await login(phone, password);

      setUser(data.user);

      addToast("ثبت‌نام با موفقیت انجام شد", "success");

      router.push("/account/orders");
    } catch (error: any) {
      const message = error?.response?.data?.message;
      const text =
        message === "User with this phone already exists"
          ? "با این شماره موبایل قبلاً ثبت‌نام شده است."
          : message || "ثبت‌نام انجام نشد. اطلاعات را بررسی کنید و دوباره تلاش کنید.";

      setError(text);
      addToast(text, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[700px] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm text-neutral-500">حساب کاربری</p>

          <h1 className="mt-2 text-3xl font-bold">ثبت‌نام</h1>

          <p className="mt-4 text-sm leading-7 text-neutral-500">
            برای ثبت سفارش راحت‌تر و پیگیری سفارش‌ها یک حساب بسازید.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                نام
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="نام و نام خانوادگی"
                autoComplete="name"
                required
                minLength={2}
                className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                شماره موبایل
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="09123456789"
                autoComplete="tel"
                required
                minLength={10}
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

              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="حداقل ۸ کاراکتر"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>

            <FormNotice message={error} />

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-glow h-12 w-full rounded-xl bg-black font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "در حال ثبت‌نام..." : "ایجاد حساب"}
            </button>
          </form>

          <div className="mt-6 border-t border-neutral-100 pt-6 text-center text-sm">
            <span className="text-neutral-500">قبلاً ثبت‌نام کرده‌اید؟</span>{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4"
            >
              وارد شوید
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
