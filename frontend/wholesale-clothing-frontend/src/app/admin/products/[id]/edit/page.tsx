"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getAdminProductById, updateProduct } from "@/services/productService";

import { getCategories } from "@/services/categoryService";
import { uploadProductImages } from "@/services/uploadService";
import { API_BASE } from "@/lib/imageUrl";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Variant = {
  _id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

type ExistingProduct = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  variants: Variant[];
  minimumOrderQuantity: number;
  isActive: boolean;
};

type FormVariant = {
  size: string;
  color: string;
  stock: string;
  sku: string;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.id as string;

  const [product, setProduct] = useState<ExistingProduct | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState("");

  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);

  const [variants, setVariants] = useState<FormVariant[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [productData, categoriesData] = await Promise.all([
          getAdminProductById(productId),
          getCategories(),
        ]);

        const loadedProduct = productData.product as ExistingProduct;

        setProduct(loadedProduct);

        setName(loadedProduct.name);
        setSlug(loadedProduct.slug);
        setDescription(loadedProduct.description || "");

        setPrice(String(loadedProduct.price));

        setMinimumOrderQuantity(String(loadedProduct.minimumOrderQuantity));

        setCategory(loadedProduct.category._id);

        setIsActive(loadedProduct.isActive);

        setExistingImages(loadedProduct.images || []);

        setVariants(
          (loadedProduct.variants || []).map((variant) => ({
            size: variant.size,
            color: variant.color,
            stock: String(variant.stock),
            sku: variant.sku,
          })),
        );

        setCategories(categoriesData.categories || categoriesData);
      } catch (err) {
        console.error(err);

        setError("خطا در دریافت اطلاعات محصول");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleNewImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidType = files.some((file) => !allowedTypes.includes(file.type));

    if (invalidType) {
      setError("فرمت تصاویر باید JPG، PNG یا WebP باشد.");

      event.target.value = "";
      return;
    }

    const invalidSize = files.some((file) => file.size > 5 * 1024 * 1024);

    if (invalidSize) {
      setError("حجم هر تصویر نباید بیشتر از 5MB باشد.");

      event.target.value = "";
      return;
    }

    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      setError("تعداد تصاویر محصول نمی‌تواند بیشتر از 5 عدد باشد.");

      event.target.value = "";
      return;
    }

    setError("");

    setNewImages((prev) => [...prev, ...files]);

    event.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        color: "",
        stock: "0",
        sku: "",
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) =>
      prev.filter((_, variantIndex) => variantIndex !== index),
    );
  };

  const updateVariant = (
    index: number,
    field: keyof FormVariant,
    value: string,
  ) => {
    setVariants((prev) =>
      prev.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    );
  };

  const validateForm = () => {
    if (name.trim().length < 2) {
      return "نام محصول حداقل باید 2 کاراکتر باشد.";
    }

    if (slug.trim().length < 2) {
      return "Slug محصول حداقل باید 2 کاراکتر باشد.";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return "قیمت محصول معتبر نیست.";
    }

    const numericMOQ = Number(minimumOrderQuantity);

    if (!Number.isInteger(numericMOQ) || numericMOQ < 1) {
      return "حداقل تعداد سفارش باید عدد صحیح و حداقل 1 باشد.";
    }

    if (!category) {
      return "دسته‌بندی محصول را انتخاب کنید.";
    }

    if (!variants.length) {
      return "حداقل یک Variant برای محصول لازم است.";
    }

    const skuSet = new Set<string>();

    for (let index = 0; index < variants.length; index++) {
      const variant = variants[index];

      if (!variant.size.trim()) {
        return `سایز Variant شماره ${index + 1} وارد نشده است.`;
      }

      if (!variant.color.trim()) {
        return `رنگ Variant شماره ${index + 1} وارد نشده است.`;
      }

      const stock = Number(variant.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        return `موجودی Variant شماره ${index + 1} معتبر نیست.`;
      }

      if (!variant.sku.trim()) {
        return `SKU Variant شماره ${index + 1} وارد نشده است.`;
      }

      if (skuSet.has(variant.sku.trim())) {
        return `SKU تکراری است: ${variant.sku}`;
      }

      skuSet.add(variant.sku.trim());
    }

    const totalImages = existingImages.length + newImages.length;

    if (totalImages > 5) {
      return "تعداد تصاویر نمی‌تواند بیشتر از 5 عدد باشد.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      let uploadedImages: string[] = [];

      if (newImages.length > 0) {
        const uploadData = await uploadProductImages(newImages);

        uploadedImages = uploadData.images || uploadData.urls || [];
      }

      const finalImages = [...existingImages, ...uploadedImages];

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        price: Number(price),
        images: finalImages,
        category,
        variants: variants.map((variant) => ({
          size: variant.size.trim(),
          color: variant.color.trim(),
          stock: Number(variant.stock),
          sku: variant.sku.trim(),
        })),
        minimumOrderQuantity: Number(minimumOrderQuantity),
        isActive,
      };

      const response = await updateProduct(productId, payload);

      setProduct(response.product);

      setExistingImages(response.product.images || []);

      setNewImages([]);

      setSuccess("محصول با موفقیت ویرایش شد.");
    } catch (err: any) {
      console.error(err);

      setError(err?.response?.data?.message || "خطا در ویرایش محصول");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-neutral-500">در حال دریافت اطلاعات محصول...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <p className="text-neutral-600">محصول پیدا نشد.</p>

        <Link
          href="/admin/products"
          className="inline-block rounded-lg bg-black px-5 py-2 text-sm text-white"
        >
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/admin/products/${product._id}/edit`}
            className="rounded-lg bg-black px-5 py-2 text-sm text-white"
          >
            ویرایش محصول
          </Link>

          <p className="mt-1 text-sm text-neutral-500">{product.name}</p>
        </div>

        <Link
          href={`/admin/products/${product._id}`}
          className="rounded-xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-50"
        >
          بازگشت به جزئیات
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* اطلاعات اصلی */}

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-6 text-lg font-bold">اطلاعات اصلی</h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                نام محصول
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Slug</label>

              <input
                dir="ltr"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-left outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">قیمت</label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                حداقل تعداد سفارش
              </label>

              <input
                type="number"
                min="1"
                value={minimumOrderQuantity}
                onChange={(event) =>
                  setMinimumOrderQuantity(event.target.value)
                }
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                دسته‌بندی
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="">انتخاب دسته‌بندی</option>

                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 self-end pb-3">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-5 w-5"
              />

              <label htmlFor="isActive" className="text-sm font-medium">
                محصول فعال باشد
              </label>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">توضیحات</label>

            <textarea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        </section>

        {/* تصاویر */}

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">تصاویر محصول</h2>

              <p className="mt-1 text-xs text-neutral-500">
                حداکثر 5 تصویر، هر تصویر حداکثر 5MB
              </p>
            </div>

            <span className="text-sm text-neutral-500">
              {existingImages.length + newImages.length} / 5
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {existingImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative overflow-hidden rounded-xl border border-gray-200"
              >
                <img
                  src={`${API_BASE}${image}`}
                  alt={name}
                  className="aspect-square w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                >
                  حذف
                </button>
              </div>
            ))}

            {newImages.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative overflow-hidden rounded-xl border border-gray-200"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="aspect-square w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          {existingImages.length + newImages.length < 5 && (
            <div className="mt-5">
              <label className="inline-flex cursor-pointer rounded-xl border border-neutral-200 px-5 py-3 text-sm transition hover:bg-neutral-50">
                افزودن تصویر
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleNewImages}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </section>

        {/* Variant ها */}

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Variant ها</h2>

              <p className="mt-1 text-xs text-neutral-500">
                سایز، رنگ، موجودی و SKU محصول
              </p>
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:bg-neutral-800"
            >
              + افزودن Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 p-4"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      سایز
                    </label>

                    <input
                      value={variant.size}
                      onChange={(event) =>
                        updateVariant(index, "size", event.target.value)
                      }
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      رنگ
                    </label>

                    <input
                      value={variant.color}
                      onChange={(event) =>
                        updateVariant(index, "color", event.target.value)
                      }
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      موجودی
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(event) =>
                        updateVariant(index, "stock", event.target.value)
                      }
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      SKU
                    </label>

                    <input
                      dir="ltr"
                      value={variant.sku}
                      onChange={(event) =>
                        updateVariant(index, "sku", event.target.value)
                      }
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-left outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-sm text-neutral-500 hover:text-black hover:underline"
                  >
                    حذف Variant
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!variants.length && (
            <div className="rounded-lg bg-neutral-50 p-5 text-center text-sm text-neutral-500">
              هنوز Variantای اضافه نشده است.
            </div>
          )}
        </section>

        {/* دکمه ها */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/admin/products/${product._id}`}
            className="rounded-xl border border-neutral-200 px-6 py-3 text-center text-sm transition hover:bg-neutral-50"
          >
            انصراف
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
