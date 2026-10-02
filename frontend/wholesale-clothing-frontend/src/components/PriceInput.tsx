"use client";

import { formatGroupedNumber, parseGroupedNumber } from "@/lib/formatPrice";

type PriceInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function PriceInput({
  value,
  onChange,
  placeholder = "مثلاً 850,000",
  className = "w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black",
}: PriceInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      dir="ltr"
      value={formatGroupedNumber(value)}
      onChange={(event) => {
        const parsed = parseGroupedNumber(event.target.value);
        onChange(Number.isNaN(parsed) ? "" : String(parsed));
      }}
      placeholder={placeholder}
      className={`${className} text-left`}
    />
  );
}
