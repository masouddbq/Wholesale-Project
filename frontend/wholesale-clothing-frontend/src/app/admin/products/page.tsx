"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminProduct, getAdminProducts } from "@/services/productService";

import { getCategories } from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  /* =========================
     Search / Filters Input
  ========================= */

  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  /* =========================
     Applied Filters
  ========================= */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);

  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [sort, setSort] = useState<SortOption>("newest");

  /* =========================
     Load Categories
  ========================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryLoading(true);

        const data = await getCategories();

        setCategories(data.categories || data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* =========================
     Load Products
  ========================= */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getAdminProducts({
        page,
        limit: 20,
        search: search || undefined,
        category: category || undefined,
        minPrice,
        maxPrice,
        sort,
      });

      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search, category, minPrice, maxPrice, sort]);

  /* =========================
     Apply Filters
  ========================= */

  const handleApplyFilters = () => {
    const parsedMinPrice =
      minPriceInput.trim() !== "" ? Number(minPriceInput) : undefined;

    const parsedMaxPrice =
      maxPriceInput.trim() !== "" ? Number(maxPriceInput) : undefined;

    if (
      parsedMinPrice !== undefined &&
      (Number.isNaN(parsedMinPrice) || parsedMinPrice < 0)
    ) {
      alert("حداقل قیمت معتبر نیست.");
      return;
    }

    if (
      parsedMaxPrice !== undefined &&
      (Number.isNaN(parsedMaxPrice) || parsedMaxPrice < 0)
    ) {
      alert("حداکثر قیمت معتبر نیست.");
      return;
    }

    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      alert("حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد.");
      return;
    }

    setPage(1);

    setSearch(searchInput.trim());
    setCategory(categoryInput);

    setMinPrice(parsedMinPrice);
    setMaxPrice(parsedMaxPrice);
  };

  /* =========================
     Reset Filters
  ========================= */

  const handleResetFilters = () => {
    setSearchInput("");
    setCategoryInput("");

    setMinPriceInput("");
    setMaxPriceInput("");

    setSearch("");
    setCategory("");

    setMinPrice(undefined);
    setMaxPrice(undefined);

    setPage(1);
  };

  /* =========================
     Format Price
  ========================= */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  /* =========================
     Total Stock
  ========================= */

  const getTotalStock = (product: AdminProduct) => {
    return product.variants.reduce(
      (total, variant) => total + variant.stock,
      0,
    );
  };

  /* =========================
     Loading
  ========================= */

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-neutral-500">در حال دریافت محصولات...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* =========================
          Header
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">محصولات</h1>

          <p className="mt-1 text-sm text-neutral-500">
            مدیریت و مشاهده محصولات فروشگاه
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          افزودن محصول
        </Link>
      </div>

      {/* =========================
          Filters
      ========================= */}

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              جستجوی محصول
            </label>

            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleApplyFilters();
                }
              }}
              placeholder="نام محصول..."
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-medium">دسته‌بندی</label>

            <select
              value={categoryInput}
              onChange={(event) => setCategoryInput(event.target.value)}
              disabled={categoryLoading}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-neutral-100"
            >
              <option value="">همه دسته‌بندی‌ها</option>

              {categories.map((categoryItem) => (
                <option key={categoryItem._id} value={categoryItem.slug}>
                  {categoryItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}

          <div>
            <label className="mb-2 block text-sm font-medium">حداقل قیمت</label>

            <input
              type="number"
              min="0"
              value={minPriceInput}
              onChange={(event) => setMinPriceInput(event.target.value)}
              placeholder="مثلاً 500000"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Max Price */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              حداکثر قیمت
            </label>

            <input
              type="number"
              min="0"
              value={maxPriceInput}
              onChange={(event) => setMaxPriceInput(event.target.value)}
              placeholder="مثلاً 5000000"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>
        </div>

        {/* =========================
            Filter Actions
        ========================= */}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {/* Sort */}

          <select
            value={sort}
            onChange={(event) => {
              setPage(1);

              setSort(event.target.value as SortOption);
            }}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
          >
            <option value="newest">جدیدترین</option>

            <option value="oldest">قدیمی‌ترین</option>

            <option value="price_asc">ارزان‌ترین</option>

            <option value="price_desc">گران‌ترین</option>

            <option value="name_asc">نام: الف تا ی</option>

            <option value="name_desc">نام: ی تا الف</option>
          </select>

          {/* Apply */}

          <button
            type="button"
            onClick={handleApplyFilters}
            className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            اعمال فیلتر
          </button>

          {/* Reset */}

          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-medium transition hover:bg-neutral-50"
          >
            حذف فیلترها
          </button>
        </div>
      </div>

      {/* =========================
          Results Info
      ========================= */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          تعداد محصولات:{" "}
          <span className="font-semibold text-black">{pagination.total}</span>
        </p>

        {loading && (
          <p className="text-sm text-neutral-500">در حال بروزرسانی...</p>
        )}
      </div>

      {/* =========================
          Products Table
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold">محصول</th>

                <th className="px-5 py-4 text-sm font-semibold">دسته‌بندی</th>

                <th className="px-5 py-4 text-sm font-semibold">قیمت</th>

                <th className="px-5 py-4 text-sm font-semibold">موجودی</th>

                <th className="px-5 py-4 text-sm font-semibold">تنوع</th>

                <th className="px-5 py-4 text-sm font-semibold">حداقل سفارش</th>

                <th className="px-5 py-4 text-sm font-semibold">وضعیت</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-neutral-500"
                  >
                    محصولی با این فیلترها پیدا نشد.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-neutral-50"
                  >
                    {/* Product */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {product.images?.[0] ? (
                            <img
                              src={`http://localhost:5000${product.images[0]}`}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                              بدون تصویر
                            </div>
                          )}
                        </div>

                        <div>
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="font-semibold transition hover:underline"
                          >
                            {product.name}
                          </Link>

                          <p
                            dir="ltr"
                            className="mt-1 text-xs text-neutral-400"
                          >
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-5 py-4 text-sm">
                      {product.category?.name || "-"}
                    </td>

                    {/* Price */}

                    <td className="px-5 py-4 text-sm font-medium">
                      {formatPrice(product.price)} تومان
                    </td>

                    {/* Stock */}

                    <td className="px-5 py-4 text-sm">
                      {formatPrice(getTotalStock(product))}
                    </td>

                    {/* Variants */}

                    <td className="px-5 py-4 text-sm">
                      {product.variants.length} تنوع
                    </td>

                    {/* MOQ */}

                    <td className="px-5 py-4 text-sm">
                      {formatPrice(product.minimumOrderQuantity)}
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isActive ? (
  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
    فعال
  </span>
) : (
  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
    غیرفعال
  </span>
)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          Pagination
      ========================= */}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            قبلی
          </button>

          <div className="rounded-xl bg-black px-4 py-2 text-sm text-white">
            صفحه {pagination.page} از {pagination.totalPages}
          </div>

          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
