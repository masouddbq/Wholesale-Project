"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/imageUrl";
import StockStatusBadge from "@/components/StockStatusBadge";

export type HomeProductCardData = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  availabilityStatus?: "in_stock" | "out_of_stock" | "limited";
  variants?: { stock: number }[];
  category?: {
    name: string;
    slug: string;
  };
};

export default function ProductCard({
  product,
}: {
  product: HomeProductCardData;
}) {
  const images = product.images || [];
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showThumbs, setShowThumbs] = useState(false);
  const image = images[previewIndex] || images[0];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price);

  const openThumbs = () => {
    if (images.length > 1) {
      setShowThumbs(true);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group product-card-glass flex h-full flex-col overflow-hidden rounded-2xl transition duration-300"
      onMouseEnter={openThumbs}
      onMouseLeave={() => {
        setShowThumbs(false);
        setPreviewIndex(0);
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden app-bg-muted">
        {image ? (
          <img
            src={`${API_BASE}${image}`}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-black text-neutral-200">W</span>
          </div>
        )}

        {product.category?.name && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] shadow-sm backdrop-blur dark:text-[#111111]">
            {product.category.name}
          </span>
        )}

        {showThumbs && images.length > 1 && (
          <div className="absolute inset-x-2 bottom-2 z-10 flex gap-1 overflow-x-auto">
            {images.slice(0, 6).map((thumb, index) => (
              <button
                key={`${thumb}-${index}`}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setPreviewIndex(index);
                }}
                className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg border ${
                  previewIndex === index
                    ? "border-black"
                    : "border-white/80"
                }`}
              >
                <img
                  src={`${API_BASE}${thumb}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-xl bg-black px-4 py-3 text-center text-xs font-medium text-white opacity-0 transition duration-300 hover:bg-neutral-800 group-hover:translate-y-0 group-hover:opacity-100 max-lg:hidden">
          مشاهده جزئیات محصول
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-[var(--text-primary)] sm:min-h-12 sm:text-base sm:leading-6">
          {product.name}
        </h3>

        <div className="mt-2 min-h-7">
          <StockStatusBadge
            status={product.availabilityStatus}
            stockCount={(product.variants || []).reduce(
              (total, variant) => total + (variant.stock || 0),
              0,
            )}
          />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[11px] leading-4 text-[var(--text-muted)]">قیمت پایه</p>
            <p className="mt-1 text-[1.05rem] font-bold leading-6 text-[var(--text-primary)] sm:text-[1.4rem] sm:leading-7">
              {formatPrice(product.price)}
              <span className="mr-1 text-[10px] font-normal text-[var(--text-muted)]">
                تومان
              </span>
            </p>
          </div>
          <span className="text-lg leading-5 text-[var(--text-muted)] transition duration-300 group-hover:-translate-x-1 group-hover:text-[var(--text-primary)]">
            ←
          </span>
        </div>
      </div>
    </Link>
  );
}
