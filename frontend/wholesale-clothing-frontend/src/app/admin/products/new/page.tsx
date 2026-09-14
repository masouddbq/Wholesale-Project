"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
} from "@/services/productService";

import {
  uploadProductImages,
} from "@/services/uploadService";

import {
  getCategories,
} from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type VariantForm = {
  size: string;
  color: string;
  stock: string;
  sku: string;
};

export default function NewProductPage() {
  const router = useRouter();

  /* =========================
     Product
  ========================= */

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] =
    useState("");

  const [price, setPrice] = useState("");
  const [minimumOrderQuantity, setMinimumOrderQuantity] =
    useState("1");

  const [category, setCategory] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  /* =========================
     Categories
  ========================= */

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [categoryLoading, setCategoryLoading] =
    useState(true);

  /* =========================
     Images
  ========================= */

  const [images, setImages] =
    useState<File[]>([]);

  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);

  /* =========================
     Variants
  ========================= */

  const [variants, setVariants] =
    useState<VariantForm[]>([
      {
        size: "",
        color: "",
        stock: "",
        sku: "",
      },
    ]);

  /* =========================
     Submit
  ========================= */

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================
     Load Categories
  ========================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryLoading(true);

        const data = await getCategories();

        setCategories(
          data.categories || data
        );
      } catch (error) {
        console.error(error);

        setError(
          "دریافت دسته‌بندی‌ها با خطا مواجه شد."
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* =========================
     Image Select
  ========================= */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > 5) {
      setError(
        "حداکثر ۵ تصویر می‌توانید انتخاب کنید."
      );

      return;
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(file.type)
    );

    if (invalidFile) {
      setError(
        "فرمت تصاویر باید JPG، PNG یا WebP باشد."
      );

      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) =>
        file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      setError(
        "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد."
      );

      return;
    }

    setError("");

    setImages(selectedFiles);

    const previews = selectedFiles.map(
      (file) => URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  /* =========================
     Remove Image
  ========================= */

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setImagePreviews((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  /* =========================
     Variant
  ========================= */

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      {
        size: "",
        color: "",
        stock: "",
        sku: "",
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((current) =>
      current.filter(
        (_, variantIndex) =>
          variantIndex !== index
      )
    );
  };

  const updateVariant = (
    index: number,
    field: keyof VariantForm,
    value: string
  ) => {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  /* =========================
     Submit
  ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    /* ---------- Basic validation ---------- */

    if (!name.trim()) {
      setError("نام محصول را وارد کنید.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug محصول را وارد کنید.");
      return;
    }

    if (!category) {
      setError("دسته‌بندی محصول را انتخاب کنید.");
      return;
    }

    const parsedPrice = Number(price);

    if (
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0
    ) {
      setError("قیمت محصول معتبر نیست.");
      return;
    }

    const parsedMOQ =
      Number(minimumOrderQuantity);

    if (
      Number.isNaN(parsedMOQ) ||
      parsedMOQ < 1
    ) {
      setError(
        "حداقل تعداد سفارش باید حداقل ۱ باشد."
      );

      return;
    }

    if (variants.length === 0) {
      setError(
        "حداقل یک تنوع برای محصول ثبت کنید."
      );

      return;
    }

    /* ---------- Validate variants ---------- */

    const preparedVariants = variants.map(
      (variant) => ({
        size: variant.size.trim(),
        color: variant.color.trim(),
        stock: Number(variant.stock),
        sku: variant.sku.trim(),
      })
    );

    const invalidVariant =
      preparedVariants.find(
        (variant) =>
          !variant.size ||
          !variant.color ||
          !variant.sku ||
          Number.isNaN(variant.stock) ||
          variant.stock < 0
      );

    if (invalidVariant) {
      setError(
        "اطلاعات تمام تنوع‌ها را کامل و صحیح وارد کنید."
      );

      return;
    }

    /* ---------- Duplicate SKU ---------- */

    const skus = preparedVariants.map(
      (variant) => variant.sku
    );

    const hasDuplicateSKU =
      new Set(skus).size !== skus.length;

    if (hasDuplicateSKU) {
      setError(
        "SKU تنوع‌ها باید یکتا باشند."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      /* =========================
         Upload Images
      ========================= */

      let uploadedImages: string[] = [];

      if (images.length > 0) {
        const uploadData =
          await uploadProductImages(images);

        uploadedImages =
          uploadData.images ||
          uploadData.urls ||
          [];
      }

      /* =========================
         Create Product
      ========================= */

      const productData =
        await createProduct({
          name: name.trim(),
          slug: slug.trim(),
          description:
            description.trim() || undefined,
          price: parsedPrice,
          images: uploadedImages,
          category,
          variants: preparedVariants,
          minimumOrderQuantity: parsedMOQ,
          isActive,
        });

      /* =========================
         Redirect
      ========================= */

      const createdProduct =
        productData.product;

      if (createdProduct?._id) {
        router.push(
          `/admin/products/${createdProduct._id}`
        );

        return;
      }

      router.push("/admin/products");
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "ساخت محصول با خطا مواجه شد."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div
      dir="rtl"
      className="space-y-6"
    >
      {/* Header */}

      <div>
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 transition hover:text-black"
        >
          ← بازگشت به محصولات
        </Link>

        <h1 className="mt-3 text-2xl font-bold">
          افزودن محصول
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          محصول جدید فروشگاه را ایجاد کنید.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* =========================
            Basic Information
        ========================= */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">
            اطلاعات اصلی
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                نام محصول
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="مثلاً هودی مردانه"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Slug
              </label>

              <input
                type="text"
                dir="ltr"
                value={slug}
                onChange={(event) =>
                  setSlug(event.target.value)
                }
                placeholder="mens-hoodie"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                قیمت
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="مثلاً 850000"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
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
                  setMinimumOrderQuantity(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                دسته‌بندی
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                disabled={categoryLoading}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black disabled:bg-neutral-100"
              >
                <option value="">
                  انتخاب دسته‌بندی
                </option>

                {categories.map(
                  (categoryItem) => (
                    <option
                      key={categoryItem._id}
                      value={categoryItem._id}
                    >
                      {categoryItem.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium">
                  محصول فعال باشد
                </span>
              </label>
            </div>

          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              توضیحات
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={5}
              placeholder="توضیحات محصول..."
              className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* =========================
            Images
        ========================= */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">
            تصاویر محصول
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            حداکثر ۵ تصویر، هر تصویر حداکثر ۵ مگابایت
          </p>

          <div className="mt-5">
            <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 px-5 py-10 text-center transition hover:border-black">
              <div>
                <p className="text-sm font-medium">
                  انتخاب تصاویر
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  JPG / PNG / WebP
                </p>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {imagePreviews.map(
                (preview, index) => (
                  <div
                    key={preview}
                    className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
                  >
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white"
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* =========================
            Variants
        ========================= */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                تنوع‌های محصول
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                سایز، رنگ، SKU و موجودی
              </p>
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
            >
              + افزودن تنوع
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {variants.map(
              (variant, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      تنوع {index + 1}
                    </p>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(index)
                        }
                        className="text-xs text-red-500 transition hover:text-red-700"
                      >
                        حذف تنوع
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">

                    <div>
                      <label className="mb-2 block text-xs font-medium">
                        سایز
                      </label>

                      <input
                        type="text"
                        value={variant.size}
                        onChange={(event) =>
                          updateVariant(
                            index,
                            "size",
                            event.target.value
                          )
                        }
                        placeholder="XL"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium">
                        رنگ
                      </label>

                      <input
                        type="text"
                        value={variant.color}
                        onChange={(event) =>
                          updateVariant(
                            index,
                            "color",
                            event.target.value
                          )
                        }
                        placeholder="مشکی"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
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
                          updateVariant(
                            index,
                            "stock",
                            event.target.value
                          )
                        }
                        placeholder="50"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium">
                        SKU
                      </label>

                      <input
                        type="text"
                        dir="ltr"
                        value={variant.sku}
                        onChange={(event) =>
                          updateVariant(
                            index,
                            "sku",
                            event.target.value
                          )
                        }
                        placeholder="HD-BLK-XL"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* =========================
            Submit
        ========================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

          <Link
            href="/admin/products"
            className="rounded-xl border border-neutral-200 px-6 py-3 text-center text-sm font-medium transition hover:bg-neutral-50"
          >
            انصراف
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "در حال ایجاد محصول..."
              : "ایجاد محصول"}
          </button>

        </div>
      </form>
    </div>
  );
}
