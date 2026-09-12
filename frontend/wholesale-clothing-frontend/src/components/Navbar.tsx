"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white text-blue-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold"
        >
          Wholesale
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/">
            خانه
          </Link>

          <Link href="/products">
            محصولات
          </Link>

          <Link href="/categories">
            دسته‌بندی‌ها
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            سبد خرید
          </Link>

          <Link href="/account">
            حساب کاربری
          </Link>
        </div>
      </div>
    </header>
  );
}