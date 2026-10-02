import Link from "next/link";
import { getProducts } from "@/services/productService";
import ProductCard, { type HomeProductCardData } from "@/components/ProductCard";
import ProductRail from "@/components/ProductRail";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  availabilityStatus?: "in_stock" | "out_of_stock" | "limited";
  variants?: { stock: number }[];
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

  return (
    <section className="border-b border-[var(--border)] bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-12 lg:px-8 lg:py-20">

        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-5">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)] max-lg:hidden">
              جدیدترین محصولات
            </p>

            <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)] sm:text-3xl max-lg:mt-0">
              محصولات منتخب
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base max-lg:hidden">
              جدیدترین محصولات عمده را مشاهده کنید و جزئیات هر محصول را
              بررسی کنید.
            </p>
          </div>

          <Link
            href="/products"
            className="btn-view-all inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
          >
            مشاهده همه محصولات
            <span>←</span>
          </Link>
        </div>

        <div className="mt-5 lg:hidden">
          <ProductRail products={products as HomeProductCardData[]} />
        </div>

        <div className="mt-8 hidden grid-cols-2 gap-4 lg:mt-10 lg:grid lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product as HomeProductCardData}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
