import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/productService";

type Variant = {
  _id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  minimumOrderQuantity: number;
  variants: Variant[];
  category?: {
    name: string;
    slug: string;
  };
};

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  let product: Product;

  try {
    const data = await getProductBySlug(slug);

    product = data.product || data;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product Image */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            {product.images?.[0] ? (
              <img
                src={`http://localhost:5000${product.images[0]}`}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                بدون تصویر
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div>
          {product.category && (
            <p className="text-sm text-neutral-500">
              {product.category.name}
            </p>
          )}

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-bold">
            {product.price.toLocaleString("fa-IR")} تومان
          </p>

          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">
                توضیحات محصول
              </h2>

              <p className="mt-3 leading-8 text-neutral-600">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">
              حداقل تعداد سفارش
            </p>

            <p className="mt-2 text-lg font-semibold">
              {product.minimumOrderQuantity} عدد
            </p>
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">
                موجودی و مشخصات
              </h2>

              <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
                <div className="grid grid-cols-4 bg-neutral-100 px-4 py-3 text-sm font-medium">
                  <span>سایز</span>
                  <span>رنگ</span>
                  <span>موجودی</span>
                  <span>SKU</span>
                </div>

                {product.variants.map((variant) => (
                  <div
                    key={variant._id}
                    className="grid grid-cols-4 border-t border-neutral-200 px-4 py-3 text-sm"
                  >
                    <span>{variant.size}</span>

                    <span>{variant.color}</span>

                    <span>
                      {variant.stock > 0
                        ? `${variant.stock} عدد`
                        : "ناموجود"}
                    </span>

                    <span className="text-neutral-500">
                      {variant.sku}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled
            className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white opacity-50"
          >
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </div>
  );
}