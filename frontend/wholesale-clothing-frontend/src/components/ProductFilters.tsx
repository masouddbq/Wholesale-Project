"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type ProductFiltersProps = {
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialSort?: string;
};

export default function ProductFilters({
  categories,
  initialSearch = "",
  initialCategory = "",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialSort = "newest",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sort, setSort] = useState(initialSort);

  const updateUrl = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");

    router.push("/products");
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            جستجو و فیلتر محصولات
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            محصول موردنظر خود را سریع‌تر پیدا کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="w-fit text-xs font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
        >
          حذف همه فیلترها
        </button>
      </div>

      <form onSubmit={updateUrl}>
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Search */}
          <div className="lg:col-span-4">
            <label
              htmlFor="search"
              className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
            >
              جستجو
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="نام محصول را وارد کنید..."
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:bg-white focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Category */}
          <div className="lg:col-span-3">
            <label
              htmlFor="category"
              className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
            >
              دسته‌بندی
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)] focus:bg-white focus:ring-2 focus:ring-black/5"
            >
              <option value="">همه دسته‌بندی‌ها</option>

              {categories.map((item) => (
                <option key={item._id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:col-span-2">
            <label
              htmlFor="sort"
              className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
            >
              مرتب‌سازی
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)] focus:bg-white focus:ring-2 focus:ring-black/5"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="price_asc">ارزان‌ترین</option>
              <option value="price_desc">گران‌ترین</option>
            </select>
          </div>

          {/* Min Price */}
          <div className="lg:col-span-1">
            <label
              htmlFor="minPrice"
              className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
            >
              حداقل
            </label>

            <input
              id="minPrice"
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="۰"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)] focus:bg-white focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Max Price */}
          <div className="lg:col-span-1">
            <label
              htmlFor="maxPrice"
              className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
            >
              حداکثر
            </label>

            <input
              id="maxPrice"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="۰"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)] focus:bg-white focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Submit */}
          <div className="flex items-end lg:col-span-1">
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
            >
              اعمال
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
