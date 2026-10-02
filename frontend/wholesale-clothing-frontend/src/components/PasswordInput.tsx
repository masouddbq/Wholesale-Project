"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
};

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 pl-12 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)]"
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
        aria-label={visible ? "مخفی کردن رمز" : "نمایش رمز"}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
