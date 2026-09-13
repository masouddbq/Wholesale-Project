import Link from "next/link";
import { getCategories } from "@/services/categoryService";

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
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              انتخاب بر اساس دسته‌بندی
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              دسته‌بندی محصولات
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              دسته‌بندی موردنظر خود را انتخاب کنید و محصولات مرتبط را مشاهده
              کنید.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-white px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
          >
            مشاهده همه
            <span>←</span>
          </Link>
        </div>

        {/* Categories */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-lg"
            >
              {/* Image / Placeholder */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)]">
                {category.image ? (
                  <img
                    src={`http://localhost:5000${category.image}`}
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
              <div className="p-4 sm:p-5">
                <h3 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-[var(--text-muted)] sm:text-sm">
                    {category.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    مشاهده محصولات
                  </span>

                  <span className="text-sm text-[var(--text-secondary)] transition group-hover:-translate-x-1">
                    ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
