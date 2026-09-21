"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <span className="text-3xl">⚠️</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          خطایی رخ داد
        </h1>

        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.
        </p>

        <button
          type="button"
          onClick={reset}
          className="btn-primary-glow mt-8 inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
        >
          تلاش مجدد
        </button>
      </div>
    </main>
  );
}
