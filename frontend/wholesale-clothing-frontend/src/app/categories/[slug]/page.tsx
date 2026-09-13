import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategoryBySlug } from "@/services/categoryService";
import { getProducts } from "@/services/productService";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
};

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  let category: Category;
  let products: Product[] = [];

  try {
    const [categoryData, productData] =
      await Promise.all([
        getCategoryBySlug(slug),
        getProducts({
          category: slug,
          limit: 100,
          sort: "newest",
        }),
      ]);

    category = categoryData.category;
    products = productData.products || [];
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/categories"
          className="text-sm text-neutral-500 transition hover:text-black"
        >
          ← بازگشت به دسته‌بندی‌ها
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr]">
          {category.image ? (
            <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100">
              <img
                src={`http://localhost:5000${category.image}`}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              بدون تصویر
            </div>
          )}

          <div className="flex flex-col justify-center">
            <p className="text-sm text-neutral-500">
              دسته‌بندی محصولات
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {category.name}
            </h1>

            {category.description && (
              <p className="mt-5 max-w-2xl leading-8 text-neutral-600">
                {category.description}
              </p>
            )}

            <p className="mt-6 text-sm text-neutral-500">
              {products.length.toLocaleString("fa-IR")} محصول
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            محصولات این دسته
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            محصولات
          </h2>
        </div>

        <Link
          href={`/products?category=${category.slug}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          مشاهده در صفحه محصولات
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 py-20 text-center">
          <p className="text-neutral-500">
            محصولی در این دسته‌بندی وجود ندارد.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-neutral-100">
                {product.images?.[0] ? (
                  <img
                    src={`http://localhost:5000${product.images[0]}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    بدون تصویر
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}