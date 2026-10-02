"use client";

import { useEffect, useRef } from "react";

export const scrollToNotice = (node?: HTMLElement | null) => {
  const target = node || document.getElementById("site-toast");

  if (!target) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
};

type FormNoticeProps = {
  message?: string;
  tone?: "neutral" | "error" | "success";
  className?: string;
};

const toneClass: Record<NonNullable<FormNoticeProps["tone"]>, string> = {
  neutral:
    "rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-700",
  error:
    "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600",
  success:
    "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700",
};

export default function FormNotice({
  message,
  tone = "neutral",
  className = "",
}: FormNoticeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) {
      scrollToNotice(ref.current);
    }
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div ref={ref} className={`${toneClass[tone]} ${className}`.trim()}>
      {message}
    </div>
  );
}
