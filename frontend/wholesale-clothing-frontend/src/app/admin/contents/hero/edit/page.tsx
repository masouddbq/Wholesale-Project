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

export default function HeroContentEditPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const response = await getSiteContent("hero");

        setFormData({
          title: response.content.data?.title || "",
          subtitle:
            response.content.data?.subtitle || "",
          buttonText:
            response.content.data?.buttonText || "",
          buttonLink:
            response.content.data?.buttonLink || "",
          image:
            response.content.data?.image || "",
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

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const response =
        await uploadSiteContentImage(file);

      setFormData((previous) => ({
        ...previous,
        image: response.image,
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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await updateSiteContent(
        "hero",
        formData
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

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-neutral-500">
          در حال دریافت اطلاعات...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">
            ویرایش Hero
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            محتوای بخش اصلی صفحه فروشگاه را مدیریت کنید.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
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

            {/* Hero Image */}
            <div>
              <label
                htmlFor="heroImage"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                تصویر Hero
              </label>

              <input
                id="heroImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={uploading}
                className="block w-full cursor-pointer rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-700 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-neutral-500">
                فرمت‌های مجاز: JPG، PNG و WebP — حداکثر 5MB
              </p>

              {uploading && (
                <p className="mt-3 text-sm text-neutral-500">
                  در حال آپلود تصویر...
                </p>
              )}

             {formData.image && !uploading && (
  <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
    <p className="mb-3 text-xs text-neutral-500">
      آدرس تصویر:
    </p>

    <p className="mb-4 break-all text-xs text-red-500">
      http://localhost:5000{formData.image}
    </p>

    <img
      src={`http://localhost:5000${formData.image}`}
      alt="Hero preview"
      width={800}
      height={450}
      className="h-auto w-full rounded-xl object-cover"
    />
  </div>
)}
            </div>
          </div>

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