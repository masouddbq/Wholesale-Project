import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-red-700 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-black">
                W
              </span>

              <div>
                <p className="text-base font-bold">
                  Wholesale
                </p>

                <p className="mt-1 text-xs text-white/80">
                  فروشگاه عمده پوشاک
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/90">
              تأمین و فروش عمده پوشاک برای فروشگاه‌ها و کسب‌وکارها،
              با تمرکز بر کیفیت، تنوع و تجربه ساده در ثبت سفارش.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              مشاهده محصولات
              <span>←</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold">
              دسترسی سریع
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  صفحه اصلی
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  محصولات
                </Link>
              </li>

              <li>
                <Link
                  href="/categories"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  دسته‌بندی‌ها
                </Link>
              </li>

              <li>
                <Link
                  href="/cart"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  سبد خرید
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-sm font-bold">
              اطلاعات
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  درباره ما
                </Link>
              </li>

              <li>
                <Link
                  href="/wholesale-guide"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  راهنمای خرید عمده
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  قوانین و شرایط سفارش
                </Link>
              </li>

              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  پیگیری سفارش‌ها
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold">
              ارتباط با ما
            </h3>

            <div className="mt-5 space-y-4">

              {/* Phone */}
              <div>
                <p className="text-xs text-white/55">
                  تلفن
                </p>

                <a
                  href="tel:+989000000000"
                  className="mt-1 block text-sm text-white/90 transition hover:text-white"
                  dir="ltr"
                >
                  ۰۹۰۰ ۰۰۰ ۰۰۰۰
                </a>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-white/55">
                  ایمیل
                </p>

                <a
                  href="mailto:info@example.com"
                  className="mt-1 block text-sm text-white/90 transition hover:text-white"
                  dir="ltr"
                >
                  info@example.com
                </a>
              </div>

              {/* Working Hours */}
              <div>
                <p className="text-xs text-white/55">
                  ساعات پاسخگویی
                </p>

                <p className="mt-1 text-sm text-white/90">
                  شنبه تا چهارشنبه، ۹ تا ۱۸
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Wholesale. تمامی حقوق محفوظ است.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="text-xs text-white/40 transition hover:text-white"
            >
              قوانین و شرایط
            </Link>

            <Link
              href="/about"
              className="text-xs text-white/40 transition hover:text-white"
            >
              درباره ما
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
