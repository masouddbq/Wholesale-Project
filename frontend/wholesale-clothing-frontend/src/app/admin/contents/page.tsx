"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getSiteContents, SiteContent } from "@/services/siteContentService";
import FormNotice from "@/components/FormNotice";
import { useToast } from "@/components/Toast";

export default function AdminContentsPage() {
  const { addToast } = useToast();
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContents = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getSiteContents();

      setContents(data.contents);
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message || "دریافت محتوای سایت با خطا مواجه شد.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, []);

  const handleDelete = async (contentKey: string) => {
    const confirmed = window.confirm(
      `آیا از حذف محتوای «${contentKey}» مطمئن هستید؟`,
    );

    if (!confirmed) {
      return;
    }

    addToast("حذف محتوا هنوز به سرور وصل نشده است.", "error");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-neutral-500">در حال دریافت محتوا...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">محتوای سایت</h1>

          <p className="mt-1 text-sm text-neutral-500">
            مدیریت محتوای بخش‌های مختلف سایت
          </p>
        </div>

        <Link
          href="/admin/contents/new"
          className="btn-primary-glow inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          افزودن محتوا
        </Link>
      </div>

      {/* Error */}
      <FormNotice message={error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/contents/footer/edit"
          className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-black"
        >
          <p className="text-sm font-semibold">فوتر</p>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            شبکه‌های اجتماعی، نقشه فروشگاه و جایگاه اینماد
          </p>
        </Link>

        <Link
          href="/admin/contents/stories/edit"
          className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-black"
        >
          <p className="text-sm font-semibold">استوری‌های صفحه اصلی</p>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            دایره‌های بالای هیرو با لینک به محصول یا دسته‌بندی
          </p>
        </Link>

        <Link
          href="/admin/contents/hero/edit"
          className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-black"
        >
          <p className="text-sm font-semibold">هیرو صفحه اصلی</p>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            عنوان، متن و عکس‌های بالای سایت
          </p>
        </Link>

        <Link
          href="/admin/contents/about/edit"
          className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-black"
        >
          <p className="text-sm font-semibold">درباره ما</p>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            متن صفحه درباره فروشگاه
          </p>
        </Link>

        <Link
          href="/admin/contents/contact/edit"
          className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-black"
        >
          <p className="text-sm font-semibold">ارتباط با ما</p>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            متن صفحه تماس؛ نقشه از تنظیمات فوتر می‌آید
          </p>
        </Link>

        <Link
          href="/admin/contents/wholesale-guide/edit"
          className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-black"
        >
          <p className="text-sm font-semibold">راهنمای خرید عمده</p>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            متن صفحه راهنما
          </p>
        </Link>

        <Link
          href="/admin/contents/terms/edit"
          className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-black"
        >
          <p className="text-sm font-semibold">قوانین و شرایط</p>
          <p className="mt-2 text-xs leading-6 text-neutral-500">
            متن صفحه قوانین سفارش
          </p>
        </Link>
      </div>

      {/* Empty */}
      {contents.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <p className="text-sm text-neutral-500">
            هنوز محتوایی برای سایت ایجاد نشده است.
          </p>

          <Link
            href="/admin/contents/new"
            className="btn-primary-glow mt-4 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            ایجاد اولین محتوا
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-right">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold">کلید</th>

                  <th className="px-5 py-4 text-sm font-semibold">اطلاعات</th>

                  <th className="px-5 py-4 text-sm font-semibold">وضعیت</th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    آخرین تغییر
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {contents.map((content) => (
                  <tr
                    key={content._id}
                    className="transition hover:bg-neutral-50"
                  >
                    {/* Key */}
                    <td className="px-5 py-4">
                      <span
                        dir="ltr"
                        className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700"
                      >
                        {content.key}
                      </span>
                    </td>

                    {/* Data */}
                    <td className="max-w-[350px] px-5 py-4">
                      <div className="space-y-1">
                        {Object.entries(content.data || {}).map(
                          ([key, value]) => (
                            <div key={key} className="flex gap-2 text-xs">
                              <span className="font-semibold text-neutral-700">
                                {key}:
                              </span>

                              <span className="truncate text-neutral-500">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        فعال
                      </span>
                    </td>

                    {/* Updated */}
                    <td className="px-5 py-4 text-sm text-neutral-500">
                      {new Date(content.updatedAt).toLocaleDateString("fa-IR")}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/contents/${content.key}/edit`}
                          className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold transition hover:bg-neutral-50"
                        >
                          ویرایش
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(content.key)}
                          className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
