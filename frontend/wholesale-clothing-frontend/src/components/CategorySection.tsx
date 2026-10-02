import Link from "next/link";
import { getCategories } from "@/services/categoryService";
import { API_BASE } from "@/lib/imageUrl";
import HorizontalScroller from "@/components/HorizontalScroller";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export default async function CategorySection() {
  let categories: Category[] = [];

  try {
    const data = await getCategories();
    categories = data.categories || [];
  } catch {
    categories = [];
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-[var(--border)] bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-12 lg:px-8 lg:py-20">

        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-5">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)] max-lg:hidden">
              انتخاب بر اساس دسته‌بندی
            </p>

            <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)] sm:text-3xl max-lg:mt-0">
              دسته‌بندی محصولات
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base max-lg:hidden">
              دسته‌بندی موردنظر خود را انتخاب کنید و محصولات مرتبط را مشاهده
              کنید.
            </p>
          </div>

          <Link
            href="/categories"
            className="btn-view-all inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
          >
            مشاهده همه
            <span>←</span>
          </Link>
        </div>

        {/* Categories */}
        <div className="home-rail-shadow mt-5 rounded-lg sm:mt-8 sm:shadow-none lg:mt-10">
        <HorizontalScroller
          desktopMinWidth={640}
          className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 sm:mt-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:touch-auto lg:grid-cols-4"
        >
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group relative flex w-[48%] shrink-0 flex-col overflow-hidden rounded-md border border-[var(--border)] bg-white shadow-[0_2px_10px_rgba(163,163,163,0.18)] transition duration-300 hover:shadow-[0_8px_24px_rgba(163,163,163,0.35)] active:shadow-[0_8px_24px_rgba(163,163,163,0.35)] sm:w-auto"
            >
              {/* Image / Placeholder */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)]">
                {category.image ? (
                  <img
                    src={`${API_BASE}${category.image}`}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-4xl font-black text-neutral-200 transition duration-300 group-hover:text-neutral-300">
                      W
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                {/* Arrow */}
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sm text-black opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
                  ←
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="line-clamp-1 min-h-6 text-base font-bold leading-6 text-[var(--text-primary)] sm:text-lg">
                  {category.name}
                </h3>

                <p className="mt-2 line-clamp-1 min-h-5 text-xs leading-5 text-[var(--text-muted)] sm:text-sm">
                  {category.description || "\u00a0"}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-xs font-medium leading-5 text-[var(--text-muted)]">
                    مشاهده محصولات
                  </span>

                  <span className="text-sm text-[var(--text-secondary)] transition group-hover:-translate-x-1">
                    ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </HorizontalScroller>
        </div>
      </div>
    </section>
  );
}
