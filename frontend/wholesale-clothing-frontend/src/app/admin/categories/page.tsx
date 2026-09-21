"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getAdminCategories,
  AdminCategory,
  deleteCategory,
} from "@/services/categoryService";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fa-IR");
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (categoryId: string, categoryName: string) => {
    const confirmed = window.confirm(
      `آیا از حذف دسته‌بندی «${categoryName}» مطمئن هستید؟`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(categoryId);
      setError("");

      await deleteCategory(categoryId);

      setCategories((current) =>
        current.filter((category) => category._id !== categoryId),
      );
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message || "حذف دسته‌بندی با خطا مواجه شد.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminCategories();

      setCategories(data.categories);
    } catch (error) {
      console.error(error);
      setError("دریافت دسته‌بندی‌ها با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>

          <p className="mt-1 text-sm text-neutral-500">
            مدیریت دسته‌بندی‌های فروشگاه
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="btn-primary-glow inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          افزودن دسته‌بندی
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
          در حال دریافت دسته‌بندی‌ها...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-right">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold">دسته‌بندی</th>

                  <th className="px-5 py-4 text-sm font-semibold">Slug</th>

                  <th className="px-5 py-4 text-sm font-semibold">توضیحات</th>

                  <th className="px-5 py-4 text-sm font-semibold">وضعیت</th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    تاریخ ایجاد
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">عملیات</th>
                </tr>
              </thead>

              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-neutral-500"
                    >
                      هنوز هیچ دسته‌بندی‌ای وجود ندارد.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      {/* Category */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              src={`http://localhost:5000${category.image}`}
                              alt={category.name}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-xs text-neutral-400">
                              بدون عکس
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">{category.name}</p>

                            <p className="mt-1 text-xs text-neutral-400">
                              {category._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4">
                        <span dir="ltr" className="text-sm text-neutral-600">
                          {category.slug}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="max-w-[250px] px-5 py-4">
                        <p className="truncate text-sm text-neutral-600">
                          {category.description || "—"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {category.isActive ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            فعال
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
                            غیرفعال
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-neutral-500">
                        {formatDate(category.createdAt)}
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/categories/${category._id}/edit`}
                            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold transition hover:bg-neutral-50"
                          >
                            ویرایش
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(category._id, category.name)
                            }
                            disabled={deletingId === category._id}
                            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === category._id
                              ? "در حال حذف..."
                              : "حذف"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
