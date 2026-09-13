"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@/services/authService";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

const navItems = [
  {
    title: "خانه",
    href: "/",
  },
  {
    title: "محصولات",
    href: "/products",
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/categories",
  },
];

const infoItems = [
  {
    title: "درباره ما",
    href: "/about",
  },
  {
    title: "راهنمای خرید عمده",
    href: "/wholesale-guide",
  },
  {
    title: "قوانین و شرایط سفارش",
    href: "/terms",
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();

  const { user, isAuthenticated } = useAuthStore();

  const cartItems = useCartStore((state) => state.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logout();

      useAuthStore.getState().clearUser();

      setIsMenuOpen(false);

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tight">
          Wholesale
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-700 transition hover:text-black"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
          >
            <span>سبد خرید</span>

            {cartCount > 0 && (
              <span className="mr-2 inline-flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {/* User */}
              <Link
                href="/account/profile"
                title="مشاهده پروفایل کاربری"
                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-black"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition group-hover:bg-black group-hover:text-white">
                  👤
                </span>

                <span className="max-w-[140px] truncate">
                  {user?.name || "کاربر"}
                </span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoggingOut ? "در حال خروج..." : "خروج"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              ورود
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 md:hidden"
          aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={isMenuOpen}
        >
          <span className="text-xl">{isMenuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col">
              {/* Main Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-neutral-100 py-4 text-sm font-medium"
                >
                  {item.title}
                </Link>
              ))}

              {/* Cart */}
              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-neutral-100 py-4 text-sm font-medium"
              >
                <span>سبد خرید</span>

                {cartCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Section */}
              {isAuthenticated ? (
                <>
                  {/* User Profile */}
                  <Link
                    href="/account/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 border-b border-neutral-200 py-4 transition hover:bg-neutral-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg transition">
                      👤
                    </span>

                    <div className="flex flex-1 flex-col">
                      <span className="text-xs text-neutral-400">
                        حساب کاربری
                      </span>

                      <span className="mt-1 text-sm font-bold text-neutral-800">
                        {user?.name || "کاربر"}
                      </span>
                    </div>

                    <span className="text-neutral-400">←</span>
                  </Link>

                  {/* Orders */}
                  <Link
                    href="/account/orders"
                    onClick={closeMenu}
                    className="border-b border-neutral-100 py-4 text-sm font-medium"
                  >
                    سفارش‌های من
                  </Link>

                  {/* Addresses */}
                  <Link
                    href="/account/addresses"
                    onClick={closeMenu}
                    className="border-b border-neutral-100 py-4 text-sm font-medium"
                  >
                    آدرس‌های من
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="border-b border-neutral-100 py-4 text-right text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {isLoggingOut ? "در حال خروج..." : "خروج از حساب"}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="border-b border-neutral-100 py-4 text-sm font-medium"
                >
                  ورود به حساب
                </Link>
              )}

              {/* Information */}
              <div className="mt-3 border-b border-neutral-200 pb-2 pt-3">
                <p className="text-xs text-neutral-400">اطلاعات فروشگاه</p>
              </div>

              {infoItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-neutral-100 py-4 text-sm font-medium"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
