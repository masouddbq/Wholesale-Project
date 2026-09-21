"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  getSiteContent,
  updateSiteContent,
} from "@/services/siteContentService";

import { uploadSiteContentImage } from "@/services/uploadService";
import { API_BASE } from "@/lib/imageUrl";

type HeroFormData = {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  images: string[];
};

export default function HeroContentEditPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<HeroFormData>({
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      images: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // Load Hero Content
  // =========================

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const response =
          await getSiteContent("hero");

        const data = response.content.data;

        const images =
          Array.isArray(data?.images) &&
          data.images.length > 0
            ? data.images
            : data?.image
            ? [data.image]
            : [];

        setFormData({
          title: data?.title || "",
          subtitle: data?.subtitle || "",
          buttonText:
            data?.buttonText || "",
          buttonLink:
            data?.buttonLink || "",
          images,
        });
      } catch (error) {
        console.error(error);

        setError(
          "خطا در دریافت اطلاعات Hero"
        );
      } finally {
        setLoading(false);
      }
    };

    loadHeroContent();
  }, []);

  // =========================
  // Text Inputs
  // =========================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // Upload Images
  // =========================

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadedImages: string[] = [];

      for (const file of Array.from(files)) {
        const response =
          await uploadSiteContentImage(file);

        if (response.image) {
          uploadedImages.push(
            response.image
          );
        }
      }

      setFormData((previous) => ({
        ...previous,
        images: [
          ...previous.images,
          ...uploadedImages,
        ],
      }));
    } catch (error) {
      console.error(error);

      setError(
        "آپلود تصویر با خطا مواجه شد."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  // =========================
  // Remove Image
  // =========================

  const handleRemoveImage = (
    index: number
  ) => {
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      ),
    }));
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await updateSiteContent(
        "hero",
        {
          title: formData.title,
          subtitle: formData.subtitle,
          buttonText:
            formData.buttonText,
          buttonLink:
            formData.buttonLink,
          images: formData.images,
        }
      );

      router.push("/admin/contents");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "ذخیره اطلاعات با خطا مواجه شد."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-neutral-500">
          در حال دریافت اطلاعات...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">
            ویرایش Hero
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            محتوای بخش اصلی صفحه فروشگاه را مدیریت کنید.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                عنوان اصلی
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="پوشاک عمده با کیفیت و قیمت مناسب"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label
                htmlFor="subtitle"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                توضیحات
              </label>

              <textarea
                id="subtitle"
                name="subtitle"
                rows={4}
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="توضیحات کوتاه درباره فروشگاه"
                className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              />
            </div>

            {/* Button Text */}
            <div>
              <label
                htmlFor="buttonText"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                متن دکمه
              </label>

              <input
                id="buttonText"
                name="buttonText"
                type="text"
                value={formData.buttonText}
                onChange={handleChange}
                placeholder="مشاهده محصولات"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              />
            </div>

            {/* Button Link */}
            <div>
              <label
                htmlFor="buttonLink"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                لینک دکمه
              </label>

              <input
                id="buttonLink"
                name="buttonLink"
                type="text"
                value={formData.buttonLink}
                onChange={handleChange}
                placeholder="/products"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              />
            </div>

            {/* Hero Images */}
            <div>
              <label
                htmlFor="heroImages"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                تصاویر Hero
              </label>

              <input
                id="heroImages"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={uploading}
                className="block w-full cursor-pointer rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-700 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-neutral-500">
                می‌توانید چند تصویر انتخاب کنید.
                فرمت‌های مجاز: JPG، PNG و WebP — حداکثر 5MB
              </p>

              {uploading && (
                <p className="mt-3 text-sm text-neutral-500">
                  در حال آپلود تصاویر...
                </p>
              )}

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-neutral-700">
                    تصاویر فعلی
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {formData.images.map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
                        >
                          <img
                            src={`${API_BASE}${image}`}
                            alt={`Hero ${index + 1}`}
                            className="h-48 w-full object-cover"
                          />

                          <div className="flex items-center justify-between gap-3 p-3">
                            <span className="text-xs text-neutral-500">
                              تصویر {index + 1}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(index)
                              }
                              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-neutral-100 pt-6">

            <button
              type="button"
              onClick={() =>
                router.push("/admin/contents")
              }
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "در حال ذخیره..."
                : "ذخیره تغییرات"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
