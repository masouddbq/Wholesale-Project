import Link from "next/link";
import { getProducts } from "@/services/productService";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
};

export default async function ProductSection() {
  const data = await getProducts();

  const products: Product[] = data.products || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            تازه‌ترین محصولات
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            محصولات جدید
          </h2>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium underline underline-offset-4"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <div className="aspect-square bg-neutral-100">
              {product.images?.[0] && (
                <img
                  src={`http://localhost:5000${product.images[0]}`}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
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
    </section>
  );
}