"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", String(page));

    router.push(`/products?${params.toString()}`);
  };

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        "...",
        totalPages,
      ];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPages();

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="صفحه‌بندی محصولات"
    >
      {/* Previous */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          handlePageChange(currentPage - 1)
        }
        className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        قبلی
      </button>

      {/* Pages */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-neutral-400"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            type="button"
            onClick={() =>
              handlePageChange(page as number)
            }
            className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition ${
              page === currentPage
                ? "pagination-active"
                : "border border-neutral-200 bg-white hover:bg-neutral-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() =>
          handlePageChange(currentPage + 1)
        }
        className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        بعدی
      </button>
    </nav>
  );
}
