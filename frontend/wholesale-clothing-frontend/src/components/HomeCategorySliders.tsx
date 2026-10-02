import Link from "next/link";
import { getCategories } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import ProductRail from "@/components/ProductRail";
import type { HomeProductCardData } from "@/components/ProductCard";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default async function HomeCategorySliders() {
  let categories: Category[] = [];

  try {
    const data = await getCategories();
    categories = data.categories || [];
  } catch {
    return null;
  }

  const rows = (
    await Promise.all(
      categories.slice(0, 8).map(async (category) => {
        try {
          const data = await getProducts({
            category: category.slug,
            limit: 8,
            sort: "newest",
          });

          return {
            category,
            products: (data.products || []) as HomeProductCardData[],
          };
        } catch {
          return { category, products: [] as HomeProductCardData[] };
        }
      }),
    )
  ).filter((row) => row.products.length > 0);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden">
      {rows.map((row) => (
        <section
          key={row.category._id}
          className="border-b border-[var(--border)] bg-transparent"
        >
          <div className="px-4 py-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {row.category.name}
              </h2>
              <Link
                href={`/categories/${row.category.slug}`}
                className="btn-view-all inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium"
              >
                مشاهده همه
                <span>←</span>
              </Link>
            </div>
            <ProductRail products={row.products} />
          </div>
        </section>
      ))}
    </div>
  );
}
