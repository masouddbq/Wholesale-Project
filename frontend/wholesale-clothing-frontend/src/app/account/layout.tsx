"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getMe } from "@/services/authService";
import useAuthStore from "@/store/authStore";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = await getMe();

        useAuthStore.getState().setUser(data.user);

        setIsCheckingAuth(false);
      } catch {
        useAuthStore.getState().clearUser();

        router.replace("/login");
      }
    };

    checkUser();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-neutral-500">
          در حال بررسی حساب کاربری...
        </p>
      </div>
    );
  }

  const menuItems = [
    {
      title: "پروفایل",
      href: "/account/profile",
    },
    {
      title: "سفارش‌های من",
      href: "/account/orders",
    },
    {
      title: "آدرس‌های من",
      href: "/account/addresses",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-3">
          <div className="px-4 py-4">
            <h2 className="text-lg font-bold">
              حساب کاربری
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              مدیریت حساب و سفارش‌ها
            </p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page Content */}
        <section className="min-w-0">
          {children}
        </section>
      </div>
    </div>
  );
}
