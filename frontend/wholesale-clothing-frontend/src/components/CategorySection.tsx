import Link from "next/link";
import { getCategories } from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export default async function CategorySection() {
  const data = await getCategories();

  const categories: Category[] = data.categories || data;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            انتخاب کن
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            دسته‌بندی محصولات
          </h2>
        </div>

        <Link
          href="/categories"
          className="text-sm font-medium underline underline-offset-4"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex min-h-32 items-end">
              <h3 className="text-xl font-semibold transition group-hover:translate-x-1">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}