import Link from "next/link";

import { getSiteContent } from "@/services/siteContentService";
import { API_BASE } from "@/lib/imageUrl";
import {
  SOCIAL_PLATFORMS,
  parseFooterContent,
  type FooterContent,
  type SocialPlatformId,
} from "@/lib/footerContent";
import StoreMap from "@/components/StoreMap";

const socialHref = (platform: SocialPlatformId, url: string) => {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  if (platform === "whatsapp" && !/^https?:\/\//i.test(trimmed)) {
    return `https://wa.me/${trimmed.replace(/[^\d]/g, "")}`;
  }

  if (platform === "telegram" && !/^https?:\/\//i.test(trimmed)) {
    return `https://t.me/${trimmed.replace(/^@/, "")}`;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
};

const SocialGlyph = ({ platform }: { platform: SocialPlatformId }) => {
  const label =
    SOCIAL_PLATFORMS.find((item) => item.id === platform)?.label || platform;

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold">
      {label.slice(0, 2)}
    </span>
  );
};

export default async function Footer() {
  let footer: FooterContent = parseFooterContent();

  try {
    const response = await getSiteContent("footer");
    const data = response.content?.data || {};
    footer = parseFooterContent(data);
  } catch {
    footer = parseFooterContent();
  }

  const visibleSocials = footer.socials.filter((item) => item.url.trim());

  return (
    <footer className="gold-shimmer-border border-t border-[var(--border)] bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-8 sm:gap-10 lg:grid-cols-4 lg:py-16">
          {footer.showEnamad && (
            <div className="col-span-2 sm:hidden">
              <h3 className="text-sm font-bold">نماد اعتماد</h3>
              <div className="mt-3 flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 text-center text-[11px] text-white/50">
                جایگاه
                <br />
                اینماد
              </div>
            </div>
          )}

          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-black">
                A
              </span>
              <div>
                <p className="text-base font-bold">AM-CLOTHING</p>
                <p className="mt-1 text-xs text-white/80">تولید و پخش پوشاک</p>
              </div>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/90">
              تأمین و فروش عمده پوشاک برای فروشگاه‌ها و کسب‌وکارها، با تمرکز بر
              کیفیت، تنوع و تجربه ساده در ثبت سفارش.
            </p>
            {visibleSocials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {visibleSocials.map((social) => {
                  const href = socialHref(social.platform, social.url);

                  return (
                    <a
                      key={`${social.platform}-${social.url}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        SOCIAL_PLATFORMS.find((item) => item.id === social.platform)
                          ?.label
                      }
                      className="overflow-hidden rounded-full transition hover:opacity-80"
                    >
                      {social.icon ? (
                        <img
                          src={`${API_BASE}${social.icon}`}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <SocialGlyph platform={social.platform} />
                      )}
                    </a>
                  );
                })}
              </div>
            )}
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              مشاهده محصولات
              <span>←</span>
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold">دسترسی سریع</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/" className="footer-link text-sm text-white/75 hover:text-white">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/products" className="footer-link text-sm text-white/75 hover:text-white">
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/categories" className="footer-link text-sm text-white/75 hover:text-white">
                  دسته‌بندی‌ها
                </Link>
              </li>
              <li>
                <Link href="/cart" className="footer-link text-sm text-white/75 hover:text-white">
                  سبد خرید
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold">اطلاعات</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/about" className="footer-link text-sm text-white/75 hover:text-white">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link text-sm text-white/75 hover:text-white">
                  ارتباط با ما
                </Link>
              </li>
              <li>
                <Link href="/guide" className="footer-link text-sm text-white/75 hover:text-white">
                  راهنمای خرید عمده
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link text-sm text-white/75 hover:text-white">
                  قوانین و شرایط سفارش
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="footer-link text-sm text-white/75 hover:text-white">
                  پیگیری سفارش‌ها
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold">ارتباط با ما</h3>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-white/55">تلفن</p>
                <a href="tel:+989366776519" className="mt-1 block text-sm text-white/90" dir="ltr">
                  ۰۹۳۶۶۷۷۶۵۱۹
                </a>
              </div>
              {footer.mapAddress && (
                <div>
                  <p className="text-xs text-white/55">آدرس</p>
                  <p className="mt-1 text-sm leading-6 text-white/90">
                    {footer.mapAddress}
                  </p>
                </div>
              )}
              <StoreMap
                lat={footer.mapLat}
                lng={footer.mapLng}
                className="mt-2"
              />
              {footer.showEnamad && (
                <div className="hidden sm:block">
                  <p className="text-xs text-white/55">نماد اعتماد</p>
                  <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 text-center text-[11px] text-white/50">
                    جایگاه
                    <br />
                    اینماد
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AM-CLOTHING. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
