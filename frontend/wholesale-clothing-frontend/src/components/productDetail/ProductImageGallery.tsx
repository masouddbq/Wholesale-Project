"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/imageUrl";

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductImageGallery({
  images,
  alt,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images?.filter(Boolean) || [];
  const activeImage = safeImages[activeIndex];

  if (safeImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
        بدون تصویر
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <img
          src={`${API_BASE}${activeImage}`}
          alt={alt}
          className="product-image-zoom h-full w-full object-cover"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`تصویر ${index + 1}`}
                aria-current={isActive}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-100 transition sm:h-20 sm:w-20 ${
                  isActive
                    ? "border-[var(--primary)]"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={`${API_BASE}${image}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
