"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroSliderProps = {
  images?: string[];
  title: string;
};

export default function HeroSlider({ images = [], title }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // =========================
  // Auto Slide
  // =========================

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  // =========================
  // Navigation
  // =========================

  const handleNext = () => {
    if (images.length <= 1) return;

    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    if (images.length <= 1) return;

    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // =========================
  // Empty State
  // =========================

  if (images.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-3xl bg-gray-100">
        <span className="text-sm text-gray-400">
          تصویری برای نمایش وجود ندارد
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-3xl">
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={`http://localhost:5000${image}`}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      ))}

      {/* Previous */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={handlePrevious}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md transition hover:bg-white"
          aria-label="تصویر قبلی"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md transition hover:bg-white"
          aria-label="تصویر بعدی"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`رفتن به تصویر ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-7 bg-white" : "w-2.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
