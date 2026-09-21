import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* شماره 404 با افکت */}
        <div className="relative inline-block">
          <p className="text-[10rem] font-black leading-none text-neutral-100 select-none">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-6xl font-black text-[var(--text-primary)]">
            404
          </p>
        </div>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          صفحه موردنظر پیدا نشد
        </h1>

        <p className="mt-4 max-w-md mx-auto leading-8 text-[var(--text-secondary)]">
          متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد
          یا ممکن است آدرس آن تغییر کرده باشد.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-primary-glow inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-3.5 font-medium text-white transition hover:bg-[var(--primary-hover)]"
          >
            بازگشت به صفحه اصلی
            <span className="mr-2">←</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white px-6 py-3.5 font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    </main>
  );
}
