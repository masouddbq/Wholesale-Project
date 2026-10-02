"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Info,
  LayoutGrid,
  Package,
  Phone,
  ShoppingCart,
} from "lucide-react";

const items = [
  { title: "محصولات", href: "/products", icon: Package },
  { title: "دسته‌بندی‌ها", href: "/categories", icon: LayoutGrid },
  { title: "سبد خرید", href: "/cart", icon: ShoppingCart },
  { title: "درباره ما", href: "/about", icon: Info },
  { title: "تماس با ما", href: "/contact", icon: Phone },
];

export default function DesktopQuickNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside
      className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-label="دسترسی سریع"
    >
      <nav className="pointer-events-auto flex flex-col gap-3 rounded-[1.75rem] border border-white/70 bg-[var(--surface)]/90 p-2 shadow-[8px_8px_18px_rgba(163,163,163,0.28),-6px_-6px_14px_rgba(255,255,255,0.9)] backdrop-blur">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className={`quick-nav-glow flex h-12 w-12 items-center justify-center rounded-2xl border transition duration-300 ${
                active
                  ? "border-[#ffd900] bg-[#ffd900] text-black shadow-[0_0_18px_rgba(255,217,0,0.75)] dark:border-neutral-400"
                  : "border-white/80 bg-white text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#ffd900] hover:bg-[#fff8c4] hover:shadow-[0_0_16px_rgba(255,217,0,0.55)] dark:border-neutral-500 dark:hover:border-neutral-400"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.1} />
              <span className="sr-only">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
