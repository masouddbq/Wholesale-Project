"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createCategory,
  getAdminCategories,
} from "@/services/categoryService";

import { uploadCategoryImage } from "@/services/uploadService";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAdminCategories();

        setExistingSlugs(
          data.categories.map((category) =>
            category.slug.toLowerCase()
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "فرمت عکس باید JPG، PNG یا WebP باشد."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "حجم عکس نمی‌تواند بیشتر از 5 مگابایت باشد."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 2) {
      setError(
        "نام دسته‌بندی باید حداقل 2 کاراکتر باشد."
      );
      return;
    }

    if (trimmedSlug.length < 2) {
      setError(
        "Slug باید حداقل 2 کاراکتر باشد."
      );
      return;
    }

    if (existingSlugs.includes(trimmedSlug)) {
      setError(
        "این Slug قبلاً استفاده شده است."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      let image = "";

      if (imageFile) {
        const uploadData =
          await uploadCategoryImage(imageFile);

        image = uploadData.image;
      }

      const data = await createCategory({
        name: trimmedName,
        slug: trimmedSlug,
        description:
          trimmedDescription || undefined,
        image: image || undefined,
        isActive,
      });

      const categoryId = data.category?._id;

      if (categoryId) {
        router.push(
          `/admin/categories/${categoryId}/edit`
        );
      } else {
        router.push("/admin/categories");
      }
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        "ایجاد دسته‌بندی با خطا مواجه شد.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-3xl space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          افزودن دسته‌بندی
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          ایجاد یک دسته‌بندی جدید برای فروشگاه
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6"
      >
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            نام دسته‌بندی
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="مثلاً تیشرت"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Slug
          </label>

          <input
            type="text"
            value={slug}
            onChange={(event) =>
              setSlug(event.target.value)
            }
            placeholder="tshirt"
            dir="ltr"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-left text-sm outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-neutral-400">
            بهتر است Slug انگلیسی و بدون فاصله باشد.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            توضیحات
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="توضیح کوتاه درباره دسته‌بندی..."
            rows={5}
            className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            تصویر دسته‌بندی
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="block w-full rounded-xl border border-neutral-200 p-3 text-sm"
          />

          <p className="mt-2 text-xs text-neutral-400">
            JPG، PNG یا WebP — حداکثر 5MB
          </p>

          {imagePreview && (
            <div className="relative mt-4 w-fit">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-40 rounded-2xl object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Active */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
          <div>
            <p className="text-sm font-semibold">
              وضعیت دسته‌بندی
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              دسته‌بندی‌های غیرفعال در بخش عمومی سایت نمایش داده نمی‌شوند.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsActive((current) => !current)
            }
            className={`relative h-7 w-12 rounded-full transition ${
              isActive
                ? "bg-black"
                : "bg-neutral-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                isActive
                  ? "right-1"
                  : "right-6"
              }`}
            />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "در حال ایجاد..."
              : "ایجاد دسته‌بندی"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/categories")
            }
            className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold transition hover:bg-neutral-50"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}