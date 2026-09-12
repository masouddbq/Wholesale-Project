import Link from "next/link";
import ProductFilters from "@/components/ProductFilters";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import Pagination from "@/components/Pagination";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const [productData, categoryData] = await Promise.all([
    getProducts({
      page,
      limit: 20,
      search: params.search,
      category: params.category,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort,
    }),
    getCategories(),
  ]);

  const products: Product[] = productData.products || [];

  const categories: Category[] = categoryData.categories || categoryData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-neutral-500">فروش عمده پوشاک</p>

        <h1 className="mt-2 text-4xl font-bold">محصولات</h1>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-500">
          محصولات عمده پوشاک را مشاهده کنید و محصول موردنظر خود را انتخاب کنید.
        </p>
      </div>

      {/* Filters */}
      <ProductFilters categories={categories} />

      {/* Products */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 py-20 text-center">
          <p className="text-neutral-500">محصولی با این مشخصات پیدا نشد.</p>
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
                <h2 className="font-semibold">{product.name}</h2>

                <p className="mt-2 text-sm text-neutral-500">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination
        currentPage={page}
        totalPages={productData.pagination?.totalPages || 1}
      />
    </div>
  );
}
