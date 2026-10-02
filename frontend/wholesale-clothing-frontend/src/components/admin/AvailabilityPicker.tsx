"use client";

import {
  AVAILABILITY_OPTIONS,
  type AvailabilityStatus,
} from "@/lib/availability";

type AvailabilityPickerProps = {
  value: AvailabilityStatus;
  onChange: (value: AvailabilityStatus) => void;
};

export default function AvailabilityPicker({
  value,
  onChange,
}: AvailabilityPickerProps) {
  return (
    <div className="md:col-span-2">
      <p className="mb-2 text-sm font-medium">وضعیت موجودی نمایشی</p>
      <div className="flex flex-wrap gap-4">
        {AVAILABILITY_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      <p className="mt-2 text-xs text-neutral-500">
        بازدیدکنندگان همین وضعیت را می‌بینند. مشتریان تأییدشده تعداد واقعی را
        می‌بینند.
      </p>
    </div>
  );
}
