"use client";

import { useEffect, useRef, type ReactNode } from "react";

type HorizontalScrollerProps = {
  children: ReactNode;
  className?: string;
  desktopMinWidth?: number;
};

export default function HorizontalScroller({
  children,
  className = "",
  desktopMinWidth,
}: HorizontalScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const isDesktop = () =>
      Boolean(
        desktopMinWidth &&
          window.matchMedia(`(min-width: ${desktopMinWidth}px)`).matches,
      );

    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let axis: "x" | "y" | null = null;

    const onTouchStart = (event: TouchEvent) => {
      if (isDesktop()) {
        return;
      }

      startX = event.touches[0].pageX;
      startY = event.touches[0].pageY;
      startScroll = el.scrollLeft;
      axis = null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (isDesktop()) {
        return;
      }

      const dx = event.touches[0].pageX - startX;
      const dy = event.touches[0].pageY - startY;

      if (!axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
          return;
        }
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (axis === "x") {
        event.preventDefault();
        el.scrollLeft = startScroll - dx;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [desktopMinWidth]);

  return (
    <div ref={ref} className={`home-h-scroll ${className}`.trim()}>
      {children}
    </div>
  );
}
