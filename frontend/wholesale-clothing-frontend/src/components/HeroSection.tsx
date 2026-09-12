import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-neutral-100">
      <div className="mx-auto flex min-h-125 max-w-7xl items-center px-4 py-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium text-neutral-500">
            فروش عمده پوشاک
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            استایل خودت را
            <br />
            از عمده‌فروشی شروع کن
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
            مجموعه‌ای از پوشاک با کیفیت برای فروشگاه‌ها،
            بوتیک‌ها و کسب‌وکارهای پوشاک.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
            >
              مشاهده محصولات
            </Link>

            <Link
              href="/categories"
              className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-medium transition hover:bg-neutral-50"
            >
              دسته‌بندی‌ها
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}