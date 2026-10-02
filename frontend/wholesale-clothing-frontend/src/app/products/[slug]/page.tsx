import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/formatPrice";
import { getProductBySlug } from "@/services/productService";
import ProductVariantSelector from "@/components/productDetail/productVariantSelector";
import ProductImageGallery from "@/components/productDetail/ProductImageGallery";
import StockStatusBadge from "@/components/StockStatusBadge";
import SeriesProductHighlight from "@/components/productDetail/SeriesProductHighlight";

type Variant = {
  _id: string;
  size: string;
  sizeSlot?: number;
  color: string;
  colorHex?: string;
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
  saleType?: "series" | "selective";
  availabilityStatus?: "in_stock" | "out_of_stock" | "limited";
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

  const isSeries = product.saleType === "series";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImageGallery
          images={product.images || []}
          alt={product.name}
        />

        {/* Product Information */}
        <div>
          {product.category && (
            <p className="text-sm text-neutral-500">{product.category.name}</p>
          )}

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {product.name}
          </h1>

          {!isSeries && (
          <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <p className="text-sm font-bold text-sky-900">محصول انتخابی</p>
            <p className="mt-1 text-xs leading-6 text-sky-800">
              از هر رنگ و سایز می‌توانید تعداد دلخواه بخرید.
            </p>
          </div>
          )}

          <div className="mt-3">
            <StockStatusBadge
              status={product.availabilityStatus}
              stockCount={
                isSeries
                  ? Array.from(
                      new Map(
                        (product.variants || []).map((variant) => [
                          variant.colorHex || variant.color,
                          variant.stock || 0,
                        ]),
                      ).values(),
                    ).reduce((total, stock) => total + stock, 0)
                  : (product.variants || []).reduce(
                      (total, variant) => total + (variant.stock || 0),
                      0,
                    )
              }
            />
          </div>

          <p className="mt-5 text-2xl font-bold">
            {formatMoney(product.price)} تومان
          </p>

          {isSeries ? (
            <SeriesProductHighlight
              description={product.description}
              minimumOrderQuantity={product.minimumOrderQuantity}
              variants={product.variants || []}
            />
          ) : (
            product.description && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">توضیحات محصول</h2>
                <p className="mt-3 leading-8 text-neutral-600">
                  {product.description}
                </p>
              </div>
            )
          )}

          {!isSeries && (
            <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm text-neutral-500">حداقل تعداد سفارش</p>
              <p className="mt-2 text-lg font-semibold">
                {product.minimumOrderQuantity} عدد
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                از هر رنگ و سایز به تعداد دلخواه انتخاب کنید؛ مجموع سفارش از این عدد کمتر نباشد.
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <ProductVariantSelector
              productId={product._id}
              productName={product.name}
              productSlug={product.slug}
              productImage={product.images?.[0]}
              price={product.price}
              variants={product.variants}
              minimumOrderQuantity={product.minimumOrderQuantity}
              saleType={isSeries ? "series" : "selective"}
              availabilityStatus={product.availabilityStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}
