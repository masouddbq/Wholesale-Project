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

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          handlePageChange(currentPage - 1)
        }
        className="rounded-lg border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        قبلی
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => handlePageChange(page)}
          className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition ${
            page === currentPage
              ? "bg-black text-white"
              : "border border-neutral-200 bg-white hover:bg-neutral-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() =>
          handlePageChange(currentPage + 1)
        }
        className="rounded-lg border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        بعدی
      </button>
    </div>
  );
}

