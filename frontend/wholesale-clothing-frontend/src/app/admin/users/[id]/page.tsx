"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getAdminUser,
  updateAdminUserRole,
  type GetAdminUserResponse,
} from "@/services/adminUserService";

const statusLabels: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تایید شده",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

const statusClasses: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200",
  confirmed:
    "bg-blue-50 text-blue-700 border-blue-200",
  preparing:
    "bg-purple-50 text-purple-700 border-purple-200",
  shipped:
    "bg-indigo-50 text-indigo-700 border-indigo-200",
  completed:
    "bg-green-50 text-green-700 border-green-200",
  cancelled:
    "bg-neutral-50 text-neutral-600 border-neutral-200",
};

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const userId = params.id as string;

  const [data, setData] =
    useState<GetAdminUserResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [changingRole, setChangingRole] =
    useState(false);

  const loadUser = async () => {
    setLoading(true);
    setError("");

    try {
  console.log("USER ID:", userId);

  const response = await getAdminUser(userId);

  console.log("ADMIN USER RESPONSE:", response);

  setData(response);
} catch (error) {
  console.error("ADMIN USER ERROR:", error);
  setError("خطا در دریافت اطلاعات کاربر");
} finally {
  setLoading(false);
}
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    loadUser();
  }, [userId]);

  const handleRoleChange = async (
    role: "customer" | "admin"
  ) => {
    if (!data) {
      return;
    }

    if (role === data.user.role) {
      return;
    }

    const confirmed = window.confirm(
      role === "admin"
        ? "آیا مطمئن هستید که می‌خواهید این کاربر را مدیر کنید؟"
        : "آیا مطمئن هستید که می‌خواهید نقش این کاربر را به مشتری تغییر دهید؟"
    );

    if (!confirmed) {
      return;
    }

    setChangingRole(true);
    setError("");

    try {
      const response =
        await updateAdminUserRole(
          data.user._id,
          role
        );

      setData((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          user: {
            ...previous.user,
            role: response.user.role,
          },
        };
      });
    } catch (error) {
      console.error(error);

      setError(
        "تغییر نقش کاربر با خطا مواجه شد."
      );
    } finally {
      setChangingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          در حال دریافت اطلاعات کاربر...
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
          {error}
        </div>

        <Link
          href="/admin/users"
          className="mt-4 inline-flex rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          بازگشت به کاربران
        </Link>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { user, orders } = data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500">
            <Link
              href="/admin/users"
              className="transition hover:text-neutral-900"
            >
              کاربران
            </Link>

            <span>/</span>

            <span>{user.name}</span>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">
            جزئیات کاربر
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            مشاهده اطلاعات، آدرس‌ها و سفارش‌های کاربر
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex w-fit items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          بازگشت به کاربران
        </Link>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {error}
        </div>
      )}

      {/* User Info */}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-neutral-900">
            اطلاعات کاربر
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            اطلاعات اصلی حساب کاربر
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-neutral-500">
              نام
            </p>

            <p className="mt-1 font-medium text-neutral-900">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500">
              شماره موبایل
            </p>

            <p
              dir="ltr"
              className="mt-1 text-right font-medium text-neutral-900"
            >
              {user.phone}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500">
              تاریخ ثبت‌نام
            </p>

            <p className="mt-1 font-medium text-neutral-900">
              {new Date(
                user.createdAt
              ).toLocaleDateString("fa-IR")}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500">
              نقش فعلی
            </p>

            <div className="mt-2">
              {user.role === "admin" ? (
                <span className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  مدیر
                </span>
              ) : (
                <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
                  مشتری
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Role */}

        <div className="mt-8 border-t border-neutral-100 pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900">
                تغییر نقش کاربر
              </h3>

              <p className="mt-1 text-xs text-neutral-500">
                با تغییر نقش، سطح دسترسی کاربر نیز تغییر می‌کند.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  changingRole ||
                  user.role === "customer"
                }
                onClick={() =>
                  handleRoleChange("customer")
                }
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  user.role === "customer"
                    ? "cursor-default bg-neutral-900 text-white"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                مشتری
              </button>

              <button
                type="button"
                disabled={
                  changingRole ||
                  user.role === "admin"
                }
                onClick={() =>
                  handleRoleChange("admin")
                }
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  user.role === "admin"
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                مدیر
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Addresses */}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-neutral-900">
            آدرس‌های کاربر
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            آدرس‌هایی که کاربر در حساب خود ثبت کرده است
          </p>
        </div>

        {user.addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
            این کاربر هنوز آدرسی ثبت نکرده است.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {user.addresses.map((address) => (
              <div
                key={address._id}
                className="rounded-xl border border-neutral-200 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-neutral-900">
                    {address.title}
                  </h3>

                  <span className="text-xs text-neutral-500">
                    {address.city}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-neutral-600">
                  <p>
                    <span className="font-medium text-neutral-800">
                      استان:
                    </span>{" "}
                    {address.province}
                  </p>

                  <p>
                    <span className="font-medium text-neutral-800">
                      شهر:
                    </span>{" "}
                    {address.city}
                  </p>

                  <p className="leading-7">
                    <span className="font-medium text-neutral-800">
                      آدرس:
                    </span>{" "}
                    {address.address}
                  </p>

                  {address.postalCode && (
                    <p>
                      <span className="font-medium text-neutral-800">
                        کد پستی:
                      </span>{" "}
                      {address.postalCode}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Orders */}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              سفارش‌های کاربر
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              تمام سفارش‌هایی که با این حساب ثبت شده‌اند
            </p>
          </div>

          <span className="w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            {orders.length} سفارش
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
            این کاربر هنوز سفارشی ثبت نکرده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-right">
              <thead>
                <tr className="border-b border-neutral-200 text-xs text-neutral-500">
                  <th className="px-4 py-3 font-medium">
                    شماره سفارش
                  </th>

                  <th className="px-4 py-3 font-medium">
                    مبلغ
                  </th>

                  <th className="px-4 py-3 font-medium">
                    وضعیت
                  </th>

                  <th className="px-4 py-3 font-medium">
                    تاریخ
                  </th>

                  <th className="px-4 py-3 font-medium">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td
                      dir="ltr"
                      className="px-4 py-4 text-right text-sm font-medium text-neutral-900"
                    >
                      {order.orderNumber}
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {order.totalAmount.toLocaleString(
                        "fa-IR"
                      )}{" "}
                      تومان
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          statusClasses[
                            order.status
                          ] ||
                          "border-neutral-200 bg-neutral-50 text-neutral-600"
                        }`}
                      >
                        {statusLabels[
                          order.status
                        ] || order.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "fa-IR"
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
                      >
                        مشاهده سفارش
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}