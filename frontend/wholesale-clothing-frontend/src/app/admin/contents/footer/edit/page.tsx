"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getSiteContent, updateSiteContent } from "@/services/siteContentService";
import { uploadSiteContentImage } from "@/services/uploadService";
import { API_BASE } from "@/lib/imageUrl";
import {
  SOCIAL_PLATFORMS,
  defaultFooterContent,
  parseFooterContent,
  type FooterContent,
  type FooterSocial,
} from "@/lib/footerContent";
import FormNotice from "@/components/FormNotice";

export default function EditFooterContentPage() {
  const router = useRouter();
  const [form, setForm] = useState<FooterContent>(defaultFooterContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getSiteContent("footer");
        setForm(parseFooterContent(response.content.data || {}));
      } catch {
        setForm(defaultFooterContent());
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const updateSocial = (index: number, patch: Partial<FooterSocial>) => {
    setForm((current) => ({
      ...current,
      socials: current.socials.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  };

  const handleIconUpload = async (index: number, file: File | undefined) => {
    if (!file) {
      return;
    }

    setError("");
    setUploadingIndex(index);

    try {
      const uploaded = await uploadSiteContentImage(file);
      updateSocial(index, { icon: uploaded.image });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "آپلود آیکون با خطا مواجه شد.",
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await updateSiteContent("footer", form);
      router.push("/admin/contents");
    } catch (err: any) {
      setError(err?.response?.data?.message || "ذخیره فوتر با خطا مواجه شد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-neutral-500">
        در حال دریافت تنظیمات فوتر...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/contents" className="text-sm text-neutral-500">
          ← بازگشت به محتوا
        </Link>
        <h1 className="mt-3 text-2xl font-bold">فوتر سایت</h1>
        <p className="mt-1 text-sm text-neutral-500">
          لینک، آیکون شبکه‌های اجتماعی، موقعیت فروشگاه و جایگاه اینماد
        </p>
      </div>

      <FormNotice message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">شبکه‌های اجتماعی</h2>
          <p className="mt-1 text-xs text-neutral-500">
            لینک و عکس آیکون را بگذارید. با زدن آیکون، کاربر به اپ یا صفحه همان
            شبکه می‌رود.
          </p>
          <div className="mt-5 space-y-4">
            {form.socials.map((social, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border border-neutral-200 p-4 md:grid-cols-[160px_1fr_auto]"
              >
                <select
                  value={social.platform}
                  onChange={(event) =>
                    updateSocial(index, {
                      platform: event.target.value as FooterSocial["platform"],
                    })
                  }
                  className="rounded-xl border border-neutral-200 px-3 py-3 text-sm"
                >
                  {SOCIAL_PLATFORMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <input
                  dir="ltr"
                  value={social.url}
                  onChange={(event) =>
                    updateSocial(index, { url: event.target.value })
                  }
                  placeholder="https://..."
                  className="rounded-xl border border-neutral-200 px-4 py-3 text-left text-sm"
                />
                <div className="flex items-center gap-3">
                  {social.icon ? (
                    <img
                      src={`${API_BASE}${social.icon}`}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed text-[10px] text-neutral-400">
                      عکس
                    </span>
                  )}
                  <label className="cursor-pointer rounded-xl border border-neutral-200 px-3 py-2 text-xs">
                    {uploadingIndex === index ? "در حال آپلود..." : "انتخاب عکس"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingIndex !== null}
                      onChange={(event) =>
                        handleIconUpload(index, event.target.files?.[0])
                      }
                    />
                  </label>
                  {social.icon && (
                    <button
                      type="button"
                      onClick={() => updateSocial(index, { icon: "" })}
                      className="text-xs text-neutral-500"
                    >
                      حذف عکس
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">موقعیت فروشگاه روی نقشه</h2>
          <p className="mt-1 text-xs text-neutral-500">
            عرض و طول جغرافیایی را از گوگل‌مپ کپی کنید. نقشه در فوتر و صفحه
            ارتباط با ما نمایش داده می‌شود.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">عرض جغرافیایی (lat)</label>
              <input
                dir="ltr"
                value={form.mapLat}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mapLat: event.target.value,
                  }))
                }
                placeholder="35.6892"
                className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-left text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">طول جغرافیایی (lng)</label>
              <input
                dir="ltr"
                value={form.mapLng}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mapLng: event.target.value,
                  }))
                }
                placeholder="51.3890"
                className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-left text-sm"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-2 block text-sm">آدرس متنی (اختیاری)</label>
            <input
              value={form.mapAddress}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  mapAddress: event.target.value,
                }))
              }
              placeholder="مثلاً تهران، خیابان ..."
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">اینماد</h2>
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.showEnamad}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  showEnamad: event.target.checked,
                }))
              }
            />
            نمایش جایگاه اینماد در فوتر (بدون تصویر)
          </label>
        </section>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/contents"
            className="rounded-xl border border-neutral-200 px-5 py-3 text-sm"
          >
            انصراف
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-black px-6 py-3 text-sm text-white disabled:opacity-50"
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره فوتر"}
          </button>
        </div>
      </form>
    </div>
  );
}
