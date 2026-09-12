"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type ProductFiltersProps = {
  categories: Category[];
};

export default function ProductFilters({
  categories,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || ""
  );

  const currentCategory =
    searchParams.get("category") || "";

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
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

    params.delete("page");

    const queryString = params.toString();

    router.push(
      queryString
        ? `/products?${queryString}`
        : "/products"
    );
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value;

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.delete("page");

    const queryString = params.toString();

    router.push(
      queryString
        ? `/products?${queryString}`
        : "/products"
    );
  };

  return (
    <div className="mb-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:p-6">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-6"
      >
        {/* Search */}
        <div className="lg:col-span-2">
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium"
          >
            جستجوی محصول
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="نام محصول را وارد کنید..."
            className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 outline-none transition focus:border-black"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium"
          >
            دسته‌بندی
          </label>

          <select
            id="category"
            value={currentCategory}
            onChange={handleCategoryChange}
            className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 outline-none transition focus:border-black"
          >
            <option value="">
              همه دسته‌بندی‌ها
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Price */}
        <div>
          <label
            htmlFor="minPrice"
            className="mb-2 block text-sm font-medium"
          >
            حداقل قیمت
          </label>

          <input
            id="minPrice"
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(event.target.value)
            }
            placeholder="مثلاً 100000"
            className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 outline-none transition focus:border-black"
          />
        </div>

        {/* Maximum Price */}
        <div>
          <label
            htmlFor="maxPrice"
            className="mb-2 block text-sm font-medium"
          >
            حداکثر قیمت
          </label>

          <input
            id="maxPrice"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
            placeholder="مثلاً 500000"
            className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 outline-none transition focus:border-black"
          />
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="sort"
            className="mb-2 block text-sm font-medium"
          >
            مرتب‌سازی
          </label>

          <select
            id="sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 outline-none transition focus:border-black"
          >
            <option value="">
              پیش‌فرض
            </option>

            <option value="newest">
              جدیدترین
            </option>

            <option value="oldest">
              قدیمی‌ترین
            </option>

            <option value="price_asc">
              ارزان‌ترین
            </option>

            <option value="price_desc">
              گران‌ترین
            </option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-black px-6 font-medium text-white transition hover:bg-neutral-800"
          >
            اعمال فیلتر
          </button>
        </div>
      </form>
    </div>
  );
}
