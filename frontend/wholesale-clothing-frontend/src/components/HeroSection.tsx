import Link from "next/link";

import { getSiteContent } from "@/services/siteContentService";
import type { HomeStory } from "@/lib/homeStories";

import HeroSlider from "./HeroSlider";
import HeroTitleWave from "./HeroTitleWave";
import StoryCircles from "./StoryCircles";

import "../app/globals.css";

const fallbackHero = {
  title: "AM CLOTHING",
  subtitle: "تأمین مستقیم پوشاک عمده برای فروشگاه‌ها و کسب‌وکارها",
  buttonText: "مشاهده محصولات",
  buttonLink: "/products",
  images: [] as string[],
  image: "",
};

export default async function HeroSection({
  stories = [],
}: {
  stories?: HomeStory[];
}) {
  let hero = fallbackHero;

  try {
    const response = await getSiteContent("hero");
    const data = response.content?.data || {};
    hero = {
      ...fallbackHero,
      ...data,
    };
  } catch {
    hero = fallbackHero;
  }

  const heroImages: string[] =
    hero.images?.length > 0 ? hero.images : hero.image ? [hero.image] : [];

  return (
    <section className="relative border-b border-[var(--border)] bg-transparent">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-neutral-100 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-neutral-100 blur-3xl" />
      </div>

      <div className="relative">
        <div className="px-4 pt-4 md:hidden">
          <StoryCircles stories={stories} placement="mobile" />
        </div>

        <div className="md:mx-[10%]">
          {heroImages.length > 0 ? (
            <HeroSlider
              images={heroImages}
              title={hero.title || "پوشاک عمده"}
              bleed
            />
          ) : (
            <div className="relative flex h-[192px] items-center justify-center overflow-hidden bg-transparent sm:h-[220px] md:h-[300px] md:rounded-2xl lg:h-[400px]">
              <span className="text-4xl font-black text-[var(--text-primary)]">W</span>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-2 pt-5 text-center md:py-8 lg:py-10">
          <div className="mb-3 mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--border)] app-bg-muted px-4 py-2 md:mb-6">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)] sm:text-sm">
              تأمین مستقیم پوشاک عمده
            </span>
          </div>

          <HeroTitleWave
            title={hero.title}
            className="text-4xl font-bold leading-[1.5] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
          />

          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:mt-6 sm:text-lg sm:leading-8">
            {hero.subtitle}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
            <Link
              href={hero.buttonLink}
              className="btn-primary-glow inline-flex items-center justify-center rounded-xl border-2 border-neutral-400 bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              {hero.buttonText}
              <span className="mr-2 text-base">←</span>
            </Link>
          </div>

          <div className="mx-auto mt-8 hidden max-w-xl grid-cols-3 gap-4 border-t border-[var(--border)] pt-6 md:grid">
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">عمده</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">مناسب فروشگاه‌ها</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">متنوع</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">مدل و سایزبندی</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">مطمئن</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">ثبت سفارش مستقیم</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
