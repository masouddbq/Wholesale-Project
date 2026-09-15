"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { logout } from "@/services/authService";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isAdmin = user?.role === "admin";

  const navItems = [
    { title: "خانه", href: "/" },
    { title: "محصولات", href: "/products" },
    { title: "دسته‌بندی‌ها", href: "/categories" },
  ];

  const infoItems = [
    { title: "درباره ما", href: "/about" },
    { title: "راهنمای خرید عمده", href: "/wholesale-guide" },
    { title: "قوانین و شرایط سفارش", href: "/terms" },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logout();

      useAuthStore.getState().clearUser();

      closeMenu();
      router.push("/login");
    } catch {
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-lg font-bold text-white transition group-hover:bg-[var(--primary-hover)]">
            W
          </span>

          <div className="hidden sm:block">
            <p className="text-base font-bold leading-none text-[var(--text-primary)]">
              Wholesale
            </p>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              فروشگاه عمده پوشاک
            </p>
          </div>
        </Link>

        {/* Desktop / Tablet Navigation */}
        <nav className="hidden items-center gap-4 md:flex lg:gap-8">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition ${
                  active
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {item.title}

                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[var(--primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop / Tablet Actions */}
        <div className="hidden items-center gap-1.5 md:flex lg:gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-2.5 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)] lg:gap-2 lg:px-4 lg:py-2.5 lg:text-sm"
          >
            <span>سبد خرید</span>

            {cartCount > 0 && (
              <span className="flex min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {/* Admin Panel */}
              {isAdmin && (
                <Link
                  href="/admin"
                  title="ورود به پنل مدیریت"
                  className={`rounded-xl border px-2.5 py-2 text-xs font-medium transition lg:px-4 lg:py-2.5 lg:text-sm ${
                    pathname.startsWith("/admin")
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  پنل ادمین
                </Link>
              )}

              {/* User */}
              <Link
                href="/account/profile"
                title="مشاهده پروفایل کاربری"
                className="group flex min-w-0 items-center gap-1.5 rounded-xl px-2 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)] lg:gap-2 lg:px-3 lg:py-2.5 lg:text-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm transition group-hover:bg-[var(--primary)] group-hover:text-white lg:h-9 lg:w-9 lg:text-base">
                  👤
                </span>

                <span className="max-w-[80px] truncate lg:max-w-[140px]">
                  {user?.name || "کاربر"}
                </span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-xl border border-red-200 px-2.5 py-2 text-xs font-medium text-[var(--danger)] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                {isLoggingOut ? "در حال خروج..." : "خروج"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-medium text-white transition hover:bg-[var(--primary-hover)] lg:px-5 lg:py-2.5 lg:text-sm"
            >
              ورود
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={isMenuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)] md:hidden"
        >
          <span className="text-xl">
            {isMenuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile / Tablet Menu */}
      {isMenuOpen && (
        <div className="border-t border-[var(--border)] bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6">
            {/* Main Navigation */}
            <nav className="border-b border-[var(--border)] py-2">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`block rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                      active
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Cart */}
            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between border-b border-[var(--border)] py-4 text-sm font-medium"
            >
              <span>سبد خرید</span>

              {cartCount > 0 && (
                <span className="flex min-w-6 items-center justify-center rounded-full bg-[var(--primary)] px-2 py-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div>
                {/* Profile */}
                <Link
                  href="/account/profile"
                  onClick={closeMenu}
                  className="group flex items-center gap-3 border-b border-[var(--border)] py-4 transition hover:bg-[var(--surface-muted)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-lg transition group-hover:bg-[var(--primary)] group-hover:text-white">
                    👤
                  </span>

                  <div className="flex flex-1 flex-col">
                    <span className="text-xs text-[var(--text-muted)]">
                      حساب کاربری
                    </span>

                    <span className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                      {user?.name || "کاربر"}
                    </span>
                  </div>

                  <span className="text-lg text-[var(--text-muted)]">
                    ←
                  </span>
                </Link>

                {/* Admin Panel */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className={`block border-b border-[var(--border)] py-4 text-sm font-bold transition ${
                      pathname.startsWith("/admin")
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    پنل ادمین
                  </Link>
                )}

                {/* Orders */}
                <Link
                  href="/account/orders"
                  onClick={closeMenu}
                  className="block border-b border-[var(--border)] py-4 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  سفارش‌های من
                </Link>

                {/* Addresses */}
                <Link
                  href="/account/addresses"
                  onClick={closeMenu}
                  className="block border-b border-[var(--border)] py-4 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  آدرس‌های من
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block w-full py-4 text-right text-sm font-medium text-[var(--danger)] transition hover:bg-red-50 disabled:opacity-50"
                >
                  {isLoggingOut
                    ? "در حال خروج..."
                    : "خروج از حساب"}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="block border-b border-[var(--border)] py-4 text-sm font-medium text-[var(--text-primary)]"
              >
                ورود به حساب
              </Link>
            )}

            {/* Information */}
            <div className="pt-3">
              <p className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
                اطلاعات
              </p>

              {infoItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
