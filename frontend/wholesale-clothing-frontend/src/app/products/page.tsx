import Link from "next/link";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";

import ProductFilters from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";

type SearchParams = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category?: {
    name: string;
    slug: string;
  };
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const query = {
    page,
    limit: 12,
    search: params.search || undefined,
    category: params.category || undefined,
    minPrice: params.minPrice
      ? Number(params.minPrice)
      : undefined,
    maxPrice: params.maxPrice
      ? Number(params.maxPrice)
      : undefined,
    sort: params.sort || "newest",
  };

  let products: Product[] = [];
  let categories: Category[] = [];
  let pagination = {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  };

  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(query),
      getCategories(),
    ]);

    products = productsData.products || [];
    pagination = productsData.pagination || pagination;
    categories = categoriesData.categories || categoriesData || [];
  } catch {
    products = [];
    categories = [];
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Page Header */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[var(--text-muted)]">
              فروشگاه عمده
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              محصولات
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              مجموعه محصولات عمده پوشاک را مشاهده کنید، محصولات موردنظر
              خود را پیدا کنید و جزئیات هر محصول را بررسی کنید.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Filters */}
          <ProductFilters
            categories={categories}
          />

          {/* Result Header */}
          <div className="mt-8 flex flex-col gap-3 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                محصولات
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {pagination.total.toLocaleString("fa-IR")} محصول پیدا شد
              </p>
            </div>

            {params.search && (
              <p className="rounded-full bg-[var(--surface-muted)] px-4 py-2 text-xs text-[var(--text-secondary)]">
                جستجو برای:{" "}
                <span className="font-semibold text-[var(--text-primary)]">
                  {params.search}
                </span>
              </p>
            )}
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                  const image = product.images?.[0];

                  return (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      className="group product-card-gold overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-xl"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-muted)]">
                        {image ? (
                          <img
                            src={`http://localhost:5000${image}`}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-6xl font-black text-neutral-200">
                              W
                            </span>
                          </div>
                        )}

                        {/* Category */}
                        {product.category?.name && (
                          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] shadow-sm backdrop-blur sm:text-xs">
                            {product.category.name}
                          </span>
                        )}

                        {/* Hover */}
                        <div className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-xl bg-black/90 px-3 py-3 text-center text-[11px] font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-xs">
                          مشاهده جزئیات محصول
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 sm:p-5">
                        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-6 text-[var(--text-primary)] sm:text-base">
                          {product.name}
                        </h3>

                        <div className="mt-4 flex items-end justify-between gap-2">
                          <div>
                            <p className="text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                              قیمت پایه
                            </p>

                            <p className="mt-1 text-sm font-bold text-[var(--text-primary)] sm:text-base">
                              {formatPrice(product.price)}

                              <span className="mr-1 text-[9px] font-normal text-[var(--text-muted)] sm:text-[10px]">
                                تومان
                              </span>
                            </p>
                          </div>

                          <span className="text-lg text-[var(--text-muted)] transition duration-300 group-hover:-translate-x-1 group-hover:text-[var(--text-primary)]">
                            ←
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                  />
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="mt-10 rounded-2xl border border-dashed border-[var(--border-strong)] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-muted)]">
                <span className="text-2xl text-[var(--text-muted)]">
                  ⌕
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-[var(--text-primary)]">
                محصولی پیدا نشد
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                با فیلترها یا عبارت جستجوی فعلی محصولی پیدا نشد.
                فیلترها را تغییر دهید یا دوباره جستجو کنید.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
              >
                مشاهده همه محصولات
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}