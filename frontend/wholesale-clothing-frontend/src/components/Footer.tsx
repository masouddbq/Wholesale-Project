export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-black">
              Wholesale
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-400">
              فروش عمده پوشاک برای فروشگاه‌ها،
              بوتیک‌ها و کسب‌وکارهای پوشاک.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold">
              دسترسی سریع
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-400">
              <a
                href="/"
                className="transition hover:text-white"
              >
                خانه
              </a>

              <a
                href="/products"
                className="transition hover:text-white"
              >
                محصولات
              </a>

              <a
                href="/categories"
                className="transition hover:text-white"
              >
                دسته‌بندی‌ها
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">
              ارتباط با ما
            </h3>

            <div className="mt-4 space-y-3 text-sm text-neutral-400">
              <p>پشتیبانی و ثبت سفارش</p>
              <p>شنبه تا پنجشنبه</p>
              <p>پاسخگویی در ساعات کاری</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
          © 2026 Wholesale Clothing — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
