import Link from "next/link";

import { getSiteContent } from "@/services/siteContentService";

export default async function HeroSection() {
  const response = await getSiteContent("hero");

  const hero = response.content.data;

  const heroImage = hero.image
    ? `http://localhost:5000${hero.image}`
    : null;

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-white">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-neutral-100 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-neutral-100 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Content */}
        <div className="max-w-2xl">
          {/* Small Label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />

            <span className="text-xs font-medium text-[var(--text-secondary)] sm:text-sm">
              تأمین مستقیم پوشاک عمده
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-[1.5] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
            {hero.subtitle}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={hero.buttonLink}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              {hero.buttonText}

              <span className="mr-2 text-base">
                ←
              </span>
            </Link>

            <Link
              href="/wholesale-guide"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
            >
              راهنمای خرید عمده
            </Link>
          </div>

          {/* Trust Items */}
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                عمده
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                مناسب فروشگاه‌ها
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                متنوع
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                مدل و سایزبندی
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                مطمئن
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                ثبت سفارش مستقیم
              </p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-xl">
          {heroImage ? (
            /* Hero Image */
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-neutral-100 shadow-2xl">
              <img
                src={heroImage}
                alt={hero.title || "پوشاک عمده"}
                className="h-full w-full object-cover"
              />

              {/* Image Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          ) : (
            /* Fallback Graphic */
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-neutral-950 p-5 shadow-2xl sm:p-8">
              {/* Background Shapes */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />

              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-white/10" />

              <div className="relative flex h-full flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/50">
                      WHOLESALE
                    </p>

                    <p className="mt-2 text-xl font-bold text-white">
                      پوشاک عمده
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-black text-black">
                    W
                  </span>
                </div>

                {/* Center */}
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] sm:h-48 sm:w-48">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-4xl font-black text-black shadow-xl sm:h-36 sm:w-36">
                      W
                    </div>
                  </div>

                  <p className="mt-6 text-sm text-white/60">
                    انتخاب هوشمندانه برای کسب‌وکار شما
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-xs text-white/50">
                    Wholesale Clothing
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    B2B
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Floating Card */}
          <div className="absolute -bottom-5 -right-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl sm:-right-6">
            <p className="text-xs text-[var(--text-muted)]">
              سفارش عمده
            </p>

            <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">
              سریع و ساده
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
