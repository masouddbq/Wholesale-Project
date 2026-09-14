"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AdminProduct,
  getAdminProductById,
} from "@/services/productService";

export default function AdminProductDetailPage() {
  const params = useParams();

  const productId = params.id as string;

  const [product, setProduct] = useState<AdminProduct | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================
     Load Product
  ========================= */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminProductById(productId);

        setProduct(data.product);
      } catch (error) {
        console.error(error);

        setError(
          "دریافت اطلاعات محصول با خطا مواجه شد."
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  /* =========================
     Format Price
  ========================= */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[400px] items-center justify-center"
      >
        <p className="text-sm text-neutral-500">
          در حال دریافت اطلاعات محصول...
        </p>
      </div>
    );
  }

  /* =========================
     Error
  ========================= */

  if (error || !product) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[400px] flex-col items-center justify-center gap-4"
      >
        <p className="text-sm text-red-500">
          {error || "محصول پیدا نشد."}
        </p>

        <Link
          href="/admin/products"
          className="rounded-xl bg-black px-5 py-3 text-sm text-white transition hover:bg-neutral-800"
        >
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  /* =========================
     Total Stock
  ========================= */

  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  return (
    <div
      dir="rtl"
      className="space-y-6"
    >
      {/* =========================
          Header
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-sm text-neutral-500 transition hover:text-black"
          >
            ← بازگشت به محصولات
          </Link>

          <h1 className="mt-3 text-2xl font-bold">
            {product.name}
          </h1>

          <p
            dir="ltr"
            className="mt-1 text-sm text-neutral-400"
          >
            {product.slug}
          </p>
        </div>

        <Link
          href={`/admin/products/${product._id}/edit`}
          className="rounded-xl bg-black px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          ویرایش محصول
        </Link>
      </div>

      {/* =========================
          Main Info
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Images */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold">
            تصاویر محصول
          </h2>

          {product.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {product.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="aspect-square overflow-hidden rounded-xl bg-neutral-100"
                >
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-100 text-sm text-neutral-400">
              تصویری ثبت نشده
            </div>
          )}
        </div>

        {/* Product Info */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-5 text-lg font-semibold">
            اطلاعات محصول
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-sm text-neutral-500">
                نام محصول
              </p>

              <p className="mt-1 font-medium">
                {product.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">
                دسته‌بندی
              </p>

              <p className="mt-1 font-medium">
                {product.category?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">
                قیمت
              </p>

              <p className="mt-1 font-medium">
                {formatPrice(product.price)} تومان
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">
                حداقل تعداد سفارش
              </p>

              <p className="mt-1 font-medium">
                {formatPrice(
                  product.minimumOrderQuantity
                )}{" "}
                عدد
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">
                موجودی کل
              </p>

              <p className="mt-1 font-medium">
                {formatPrice(totalStock)} عدد
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">
                وضعیت
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  product.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.isActive
                  ? "فعال"
                  : "غیرفعال"}
              </span>
            </div>

          </div>

          {/* Description */}

          <div className="mt-6 border-t border-neutral-100 pt-6">
            <p className="text-sm text-neutral-500">
              توضیحات
            </p>

            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-neutral-700">
              {product.description ||
                "توضیحاتی برای این محصول ثبت نشده است."}
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          Variants
      ========================= */}

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              تنوع‌های محصول
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              سایز، رنگ، SKU و موجودی هر تنوع
            </p>
          </div>

          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
            {product.variants.length} تنوع
          </span>
        </div>

        {product.variants.length === 0 ? (
          <div className="rounded-xl bg-neutral-50 py-10 text-center text-sm text-neutral-500">
            برای این محصول تنوعی ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-right">

              <thead className="border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-4 text-sm font-semibold">
                    #
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold">
                    سایز
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold">
                    رنگ
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold">
                    SKU
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold">
                    موجودی
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {product.variants.map(
                  (variant, index) => (
                    <tr
                      key={variant._id}
                      className="transition hover:bg-neutral-50"
                    >
                      <td className="px-4 py-4 text-sm text-neutral-500">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium">
                        {variant.size}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {variant.color}
                      </td>

                      <td
                        dir="ltr"
                        className="px-4 py-4 text-sm text-neutral-500"
                      >
                        {variant.sku}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            variant.stock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {formatPrice(
                            variant.stock
                          )}{" "}
                          عدد
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
