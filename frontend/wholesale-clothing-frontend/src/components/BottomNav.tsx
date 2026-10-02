"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Package,
  LayoutGrid,
  ShoppingCart,
  Home,
} from "lucide-react";

import useCartStore from "@/store/cartStore";

const navItems = [
  {
    title: "خانه",
    href: "/",
    icon: Home,
  },
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

const itemClass =
  "relative flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearchClick = () => {
    if (pathname === "/") {
      const searchElement = document.getElementById("site-search");

      if (searchElement) {
        searchElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        const input = searchElement.querySelector("input");

        if (input) {
          setTimeout(() => {
            input.focus();
          }, 400);
        }
      }

      return;
    }

    router.push("/#site-search");
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex h-12 max-w-md items-center justify-around px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${itemClass} ${
                active ? "text-black" : "text-neutral-500 active:scale-95"
              }`}
            >
              <Icon
                className="h-4 w-4"
                strokeWidth={active ? 2.4 : 1.8}
              />

              <span>{item.title}</span>

              {active && (
                <span className="absolute bottom-0 h-0.5 w-5 rounded-full bg-black" />
              )}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleSearchClick}
          className={`${itemClass} text-neutral-500 active:scale-95`}
        >
          <Search className="h-4 w-4" strokeWidth={1.8} />
          <span>جستجو</span>
        </button>

        <Link
          href="/cart"
          className={`${itemClass} ${
            pathname.startsWith("/cart")
              ? "text-black"
              : "text-neutral-500"
          }`}
        >
          <div className="relative">
            <ShoppingCart
              className="h-4 w-4"
              strokeWidth={pathname.startsWith("/cart") ? 2.4 : 1.8}
            />

            {cartCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-black px-1 text-[8px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>

          <span>سبد خرید</span>

          {pathname.startsWith("/cart") && (
            <span className="absolute bottom-0 h-0.5 w-5 rounded-full bg-black" />
          )}
        </Link>
      </div>
    </nav>
  );
}
