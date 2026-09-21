"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";

import {
  getProducts,
  type ProductQuery,
} from "@/services/productService";
import { API_BASE } from "@/lib/imageUrl";

type SearchProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category?: {
    name: string;
    slug: string;
  };
};

export default function SearchBar() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<SearchProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // =========================
  // Autocomplete Search
  // =========================

  useEffect(() => {
    const value = search.trim();

    if (value.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);

        const query: ProductQuery = {
          search: value,
          limit: 5,
        };

        const response = await getProducts(query);

        setSuggestions(response.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error(
          "SEARCH AUTOCOMPLETE ERROR:",
          error
        );

        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // Close suggestions
  // =========================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // Main Search
  // =========================

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    setShowSuggestions(false);

    router.push(
      `/products?search=${encodeURIComponent(trimmedValue)}`
    );
  };

  // =========================
  // Form Submit
  // =========================

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    handleSearch(search);
  };

  // =========================
  // Suggestion Click
  // =========================

  const handleSuggestionClick = (slug: string) => {
    setShowSuggestions(false);

    router.push(`/products/${slug}`);
  };

  // تغییر جدید: افکت shimmer طلایی در سرچ‌بار
  return (
    <section
      id="site-search"
      className="scroll-mt-24 px-4 py-8 sm:py-10"
    >
      <div
        ref={searchRef}
        className="relative mx-auto max-w-3xl pb-2"
      >
        {/* Title */}

        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            دنبال چه محصولی هستید؟
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            نام محصول یا کد محصول را جستجو کنید
          </p>
        </div>

        {/* Search Form */}

        <form
          onSubmit={handleSubmit}
          className="flex items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-sm transition focus-within:border-[var(--accent)] focus-within:ring-4 focus-within:ring-[rgba(201,169,110,0.15)]"
        >
          <div className="flex flex-1 items-center">
            <Search className="mr-2 h-5 w-5 shrink-0 text-neutral-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="مثلاً تیشرت، هودی یا کد محصول..."
              className="h-11 w-full bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-base"
            />
          </div>

          <button
            type="submit"
            disabled={!search.trim()}
            className="btn-primary-glow h-11 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7"
          >
            جستجو
          </button>
        </form>

        {/* Suggestions */}

        {showSuggestions &&
          search.trim().length >= 2 && (
            <div className="absolute inset-x-4 top-[108px] z-40 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl sm:inset-x-0">
              {/* Loading */}

              {isLoading && (
                <div className="px-5 py-4 text-sm text-neutral-500">
                  در حال جستجو...
                </div>
              )}

              {/* No Results */}

              {!isLoading &&
                suggestions.length === 0 && (
                  <div className="px-5 py-4 text-sm text-neutral-500">
                    محصولی با این عبارت پیدا نشد.
                  </div>
                )}

              {/* Results */}

              {!isLoading &&
                suggestions.length > 0 && (
                  <div>
                    {suggestions.map((product) => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            product.slug
                          )
                        }
                        className="flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-right transition last:border-b-0 hover:bg-neutral-50"
                      >
                        {/* Product Image */}

                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {product.images?.[0] && (
                            <img
                              src={`${API_BASE}${product.images[0]}`}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {/* Product Info */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {product.price.toLocaleString(
                              "fa-IR"
                            )}{" "}
                            تومان
                          </p>
                        </div>

                        <ArrowLeft className="h-4 w-4 shrink-0 text-neutral-400" />
                      </button>
                    ))}

                    {/* View All Results */}

                    <button
                      type="button"
                      onClick={() =>
                        handleSearch(search)
                      }
                      className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-black transition hover:bg-neutral-50"
                    >
                      مشاهده همه نتایج

                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                )}
            </div>
          )}
      </div>
    </section>
  );
}
