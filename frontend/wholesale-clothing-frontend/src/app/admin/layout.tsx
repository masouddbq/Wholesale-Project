"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getMe } from "@/services/authService";
import useAuthStore from "@/store/authStore";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const data = await getMe();

        const user = data.user;

        useAuthStore.getState().setUser(user);

        if (user.role !== "admin") {
          router.replace("/account");
          return;
        }

        setIsCheckingAuth(false);
      } catch {
        useAuthStore.getState().clearUser();

        router.replace("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />

          <p className="mt-4 text-sm text-neutral-500">
            در حال بررسی دسترسی...
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "داشبورد",
      href: "/admin",
    },
    {
      title: "سفارش‌ها",
      href: "/admin/orders",
    },
    {
      title: "محصولات",
      href: "/admin/products",
    },
    {
      title: "دسته‌بندی‌ها",
      href: "/admin/categories",
    },
    {
      title: "کاربران",
      href: "/admin/users",
    },
    {
      title: "محتوای سایت",
      href: "/admin/contents",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-[calc(100vh-80px)] w-64 shrink-0 border-l border-neutral-200 bg-white lg:block">
          <div className="sticky top-[80px] p-5">
            <div className="mb-6 rounded-2xl bg-black p-5 text-white">
              <p className="text-xs text-neutral-400">
                پنل مدیریت
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Wholesale Admin
              </h2>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

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

            <div className="mt-8 border-t border-neutral-200 pt-5">
              <Link
                href="/"
                className="block rounded-xl px-4 py-3 text-sm text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
              >
                ← مشاهده سایت
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-6 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}