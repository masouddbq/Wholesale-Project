"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getAdminUsers,
  type AdminUser,
} from "@/services/adminUserService";

type RoleFilter = "" | "customer" | "admin";

type SortOption =
  | "newest"
  | "oldest"
  | "name";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 20,
      totalUsers: 0,
      totalPages: 0,
    });

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [roleInput, setRoleInput] =
    useState<RoleFilter>("");

  const [role, setRole] =
    useState<RoleFilter>("");

  const [sort, setSort] =
    useState<SortOption>("newest");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: role || undefined,
        sort,
      });

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error
      );

      setError(
        "دریافت کاربران با مشکل مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search, role, sort]);

  const handleApplyFilters = () => {
    setPage(1);
    setSearch(searchInput.trim());
    setRole(roleInput);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setRoleInput("");

    setSearch("");
    setRole("");

    setSort("newest");

    setPage(1);
  };

  const handleSortChange = (
    value: SortOption
  ) => {
    setPage(1);
    setSort(value);
  };

  const handleRoleChange = (
    value: RoleFilter
  ) => {
    setPage(1);
    setRoleInput(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getRoleLabel = (
    userRole: AdminUser["role"]
  ) => {
    return userRole === "admin"
      ? "مدیر"
      : "مشتری";
  };

  const getRoleClass = (
    userRole: AdminUser["role"]
  ) => {
    return userRole === "admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-neutral-100 text-neutral-600";
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-neutral-500">
          در حال دریافت کاربران...
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="space-y-6"
    >
      {/* Header */}

      <div>
        <p className="text-sm text-neutral-500">
          مدیریت فروشگاه
        </p>

        <h1 className="mt-2 text-2xl font-bold">
          کاربران
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          مشاهده و مدیریت کاربران فروشگاه
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_220px_180px]">
          {/* Search */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              جستجوی کاربر
            </label>

            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleApplyFilters();
                }
              }}
              placeholder="نام یا شماره موبایل..."
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Role */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              نقش
            </label>

            <select
              value={roleInput}
              onChange={(event) =>
                handleRoleChange(
                  event.target.value as RoleFilter
                )
              }
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            >
              <option value="">
                همه کاربران
              </option>

              <option value="customer">
                مشتری
              </option>

              <option value="admin">
                مدیر
              </option>
            </select>
          </div>

          {/* Sort */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              مرتب‌سازی
            </label>

            <select
              value={sort}
              onChange={(event) =>
                handleSortChange(
                  event.target.value as SortOption
                )
              }
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            >
              <option value="newest">
                جدیدترین
              </option>

              <option value="oldest">
                قدیمی‌ترین
              </option>

              <option value="name">
                نام
              </option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            اعمال فیلتر
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-medium transition hover:bg-neutral-50"
          >
            حذف فیلترها
          </button>
        </div>
      </div>

      {/* Results Info */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          تعداد کاربران:{" "}
          <span className="font-semibold text-black">
            {pagination.totalUsers.toLocaleString(
              "fa-IR"
            )}
          </span>
        </p>

        {loading && (
          <p className="text-sm text-neutral-500">
            در حال بروزرسانی...
          </p>
        )}
      </div>

      {/* Users Table */}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-right">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold">
                  کاربر
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  موبایل
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  نقش
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  تاریخ ثبت‌نام
                </th>

                <th className="px-5 py-4 text-sm font-semibold">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-neutral-500"
                  >
                    کاربری با این مشخصات پیدا نشد.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-neutral-50"
                  >
                    {/* User */}

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="font-semibold transition hover:underline"
                      >
                        {user.name}
                      </Link>

                      <p
                        dir="ltr"
                        className="mt-1 text-xs text-neutral-400"
                      >
                        {user._id}
                      </p>
                    </td>

                    {/* Phone */}

                    <td className="px-5 py-4">
                      <span
                        dir="ltr"
                        className="text-sm"
                      >
                        {user.phone}
                      </span>
                    </td>

                    {/* Role */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(
                          user.role
                        )}
                      </span>
                    </td>

                    {/* Date */}

                    <td className="px-5 py-4">
                      <span className="text-sm text-neutral-500">
                        {formatDate(
                          user.createdAt
                        )}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="inline-flex rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
                      >
                        مشاهده
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage(
                (current) =>
                  Math.max(current - 1, 1)
              )
            }
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            قبلی
          </button>

          <div className="rounded-xl bg-black px-4 py-2 text-sm text-white">
            صفحه{" "}
            {pagination.page.toLocaleString(
              "fa-IR"
            )}{" "}
            از{" "}
            {pagination.totalPages.toLocaleString(
              "fa-IR"
            )}
          </div>

          <button
            type="button"
            disabled={
              page >= pagination.totalPages
            }
            onClick={() =>
              setPage(
                (current) =>
                  Math.min(
                    current + 1,
                    pagination.totalPages
                  )
              )
            }
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}