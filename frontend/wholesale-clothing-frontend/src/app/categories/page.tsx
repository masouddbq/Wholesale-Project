import Link from "next/link";
import { getCategories } from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export default async function CategoriesPage() {
  const data = await getCategories();

  const categories: Category[] =
    data.categories || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <p className="text-sm text-neutral-500">
          فروش عمده پوشاک
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          دسته‌بندی محصولات
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-500">
          دسته‌بندی موردنظر خود را انتخاب کنید و محصولات آن را مشاهده کنید.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 py-20 text-center">
          <p className="text-neutral-500">
            دسته‌بندی‌ای برای نمایش وجود ندارد.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                {category.image ? (
                  <img
                    src={`http://localhost:5000${category.image}`}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    بدون تصویر
                  </div>
                )}
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold transition group-hover:translate-x-1">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                    {category.description}
                  </p>
                )}

                <span className="mt-4 inline-block text-sm font-medium">
                  مشاهده محصولات ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}