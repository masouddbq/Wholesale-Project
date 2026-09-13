import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="text-8xl font-black tracking-tight text-neutral-200">
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold md:text-4xl">
          صفحه موردنظر پیدا نشد
        </h1>

        <p className="mt-4 leading-8 text-neutral-500">
          متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد
          یا ممکن است آدرس آن تغییر کرده باشد.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-black px-6 py-3.5 font-medium text-white transition hover:bg-neutral-800"
          >
            بازگشت به صفحه اصلی
          </Link>

          <Link
            href="/products"
            className="rounded-xl border border-neutral-300 px-6 py-3.5 font-medium transition hover:bg-neutral-50"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    </main>
  );
}