"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import {
  AdminCategory,
  getAdminCategories,
  updateCategory,
} from "@/services/categoryService";

import { uploadCategoryImage } from "@/services/uploadService";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();

  const categoryId = params.id as string;

  const [category, setCategory] =
    useState<AdminCategory | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] =
    useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminCategories();

        const foundCategory =
          data.categories.find(
            (item) => item._id === categoryId
          );

        if (!foundCategory) {
          setError("دسته‌بندی موردنظر پیدا نشد.");
          return;
        }

        setCategory(foundCategory);

        setName(foundCategory.name);
        setSlug(foundCategory.slug);
        setDescription(
          foundCategory.description || ""
        );
        setIsActive(foundCategory.isActive);
        setCurrentImage(
          foundCategory.image || ""
        );
      } catch (error) {
        console.error(error);

        setError(
          "دریافت اطلاعات دسته‌بندی با خطا مواجه شد."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

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

  const removeCurrentImage = () => {
    setCurrentImage("");
  };

  const removeNewImage = () => {
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
    const trimmedDescription =
      description.trim();

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

    try {
      setIsSubmitting(true);

      let image = currentImage;

      if (imageFile) {
        const uploadData =
          await uploadCategoryImage(imageFile);

        image = uploadData.image;
      }

      await updateCategory(categoryId, {
        name: trimmedName,
        slug: trimmedSlug,
        description:
          trimmedDescription || undefined,
        image: image || undefined,
        isActive,
      });

      router.push("/admin/categories");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        "ویرایش دسته‌بندی با خطا مواجه شد.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500"
      >
        در حال دریافت اطلاعات دسته‌بندی...
      </div>
    );
  }

  if (!category) {
    return (
      <div dir="rtl" className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          {error || "دسته‌بندی پیدا نشد."}
        </div>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/categories")
          }
          className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          بازگشت به دسته‌بندی‌ها
        </button>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-3xl space-y-6"
    >
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold">
          ویرایش دسته‌بندی
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          اطلاعات دسته‌بندی را ویرایش کنید.
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
            dir="ltr"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-left text-sm outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-neutral-400">
            Slug بهتر است انگلیسی و بدون فاصله باشد.
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
            rows={5}
            className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Current Image */}

        <div>
          <label className="mb-3 block text-sm font-semibold">
            تصویر فعلی
          </label>

          {currentImage ? (
            <div className="relative w-fit">
              <img
                src={`http://localhost:5000${currentImage}`}
                alt={name}
                className="h-40 w-40 rounded-2xl object-cover"
              />

              <button
                type="button"
                onClick={removeCurrentImage}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-neutral-100 text-xs text-neutral-400">
              بدون تصویر
            </div>
          )}
        </div>

        {/* New Image */}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            تصویر جدید
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
                alt="تصویر جدید"
                className="h-40 w-40 rounded-2xl object-cover"
              />

              <button
                type="button"
                onClick={removeNewImage}
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
              دسته‌بندی غیرفعال در سایت عمومی نمایش داده نمی‌شود.
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

        {/* Actions */}

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "در حال ذخیره..."
              : "ذخیره تغییرات"}
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
