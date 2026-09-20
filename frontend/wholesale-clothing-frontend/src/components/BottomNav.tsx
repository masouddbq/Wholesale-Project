"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Package,
  LayoutGrid,
  ShoppingCart,
} from "lucide-react";

import useCartStore from "@/store/cartStore";

const navItems = [
  {
    title: "محصولات",
    href: "/products",
    icon: Package,
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/categories",
    icon: LayoutGrid,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const items = useCartStore(
    (state) => state.items
  );

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearchClick = () => {
    if (pathname === "/") {
      const searchElement =
        document.getElementById("site-search");

      if (searchElement) {
        searchElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        const input =
          searchElement.querySelector("input");

        if (input) {
          setTimeout(() => {
            input.focus();
          }, 400);
        }
      }
    }
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/products"
              ? pathname.startsWith("/products")
              : pathname.startsWith("/categories");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex h-full min-w-[72px] flex-col items-center justify-center gap-1 text-xs font-medium transition ${
                isActive
                  ? "text-red-500"
                  : "text-neutral-500"
              }`}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={
                  isActive ? 2.4 : 1.8
                }
              />

              <span>{item.title}</span>

              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-7 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}

        {/* Search - فقط صفحه اصلی */}

        {pathname === "/" && (
          <button
            type="button"
            onClick={handleSearchClick}
            className="relative flex h-full min-w-[72px] flex-col items-center justify-center gap-1 text-xs font-medium text-neutral-500 transition active:scale-95"
          >
            <Search
              className="h-5 w-5"
              strokeWidth={1.8}
            />

            <span className="text-sm ">جستجو</span>
          </button>
        )}

        {/* Cart */}

        <Link
          href="/cart"
          className={`relative flex h-full min-w-[72px] flex-col items-center justify-center gap-1 text-xs font-medium transition ${
            pathname.startsWith("/cart")
              ? "text-red-500"
              : "text-neutral-500"
          }`}
        >
          <div className="relative">
            <ShoppingCart
              className="h-5 w-5"
              strokeWidth={
                pathname.startsWith("/cart")
                  ? 2.4
                  : 1.8
              }
            />

            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}
          </div>

          <span>سبد خرید</span>

          {pathname.startsWith("/cart") && (
            <span className="absolute bottom-0 h-0.5 w-7 rounded-full bg-red-500" />
          )}
        </Link>
      </div>
    </nav>
  );
}
