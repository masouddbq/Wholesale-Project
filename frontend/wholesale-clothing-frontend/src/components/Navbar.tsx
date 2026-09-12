"use client";

import Link from "next/link";
import { useState } from "react";

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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tight"
        >
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
          <Link
            href="/cart"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
          >
            سبد خرید
          </Link>

          <Link
            href="/account"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            حساب کاربری
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 md:hidden"
          aria-label="باز کردن منو"
          aria-expanded={isMenuOpen}
        >
          <span className="text-xl">
            {isMenuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="border-b border-neutral-100 py-4 text-sm font-medium"
                >
                  {item.title}
                </Link>
              ))}

              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-neutral-100 py-4 text-sm font-medium"
              >
                سبد خرید
              </Link>

              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="py-4 text-sm font-medium"
              >
                حساب کاربری
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
