import Link from "next/link";
import { getProducts } from "@/services/productService";

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

export default async function ProductSection() {
  let products: Product[] = [];

  try {
    const data = await getProducts({
      limit: 8,
      sort: "newest",
    });

    products = data.products || [];
  } catch {
    products = [];
  }

  if (products.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  return (
    <section className="border-b border-[var(--border)] bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              جدیدترین محصولات
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              محصولات منتخب
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              جدیدترین محصولات عمده را مشاهده کنید و جزئیات هر محصول را
              بررسی کنید.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
          >
            مشاهده همه محصولات
            <span>←</span>
          </Link>
        </div>

        {/* Products */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                      <span className="text-5xl font-black text-neutral-200">
                        W
                      </span>
                    </div>
                  )}

                  {/* Category */}
                  {product.category?.name && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] shadow-sm backdrop-blur">
                      {product.category.name}
                    </span>
                  )}

                  {/* Hover Action */}
                  <div className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-xl bg-black hover:bg-neutral-800 px-4 py-3 text-center text-xs font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    مشاهده جزئیات محصول
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <h3 className="line-clamp-1 text-sm font-bold text-[var(--text-primary)] sm:text-base">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        قیمت پایه
                      </p>

                      <p className="mt-1 text-sm font-bold text-[var(--text-primary)] sm:text-base">
                        {formatPrice(product.price)}
                        <span className="mr-1 text-[10px] font-normal text-[var(--text-muted)]">
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
      </div>
    </section>
  );
}
