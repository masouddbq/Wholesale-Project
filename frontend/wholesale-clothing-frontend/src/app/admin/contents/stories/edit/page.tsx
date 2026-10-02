"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getSiteContent, updateSiteContent } from "@/services/siteContentService";
import { uploadSiteContentImage } from "@/services/uploadService";
import { getAdminProducts, type AdminProduct } from "@/services/productService";
import {
  getAdminCategories,
  type AdminCategory,
} from "@/services/categoryService";
import { API_BASE } from "@/lib/imageUrl";
import FormNotice from "@/components/FormNotice";
import { useToast } from "@/components/Toast";
import type { HomeStory } from "@/lib/homeStories";

const newStory = (): HomeStory => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `story-${Date.now()}`,
  image: "",
  title: "",
  linkType: "product",
  slug: "",
});

export default function StoriesContentEditPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [stories, setStories] = useState<HomeStory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getAdminProducts({ limit: 100, sort: "newest" }),
          getAdminCategories(),
        ]);

        setProducts(productData.products || []);
        setCategories(categoryData.categories || []);

        try {
          const response = await getSiteContent("stories");
          const items = response.content?.data?.items;
          if (Array.isArray(items)) {
            setStories(
              items.map((item: HomeStory, index: number) => ({
                id: item.id || `story-${index}`,
                image: item.image || "",
                title: item.title || "",
                linkType: item.linkType === "category" ? "category" : "product",
                slug: item.slug || "",
              })),
            );
          }
        } catch {
          setStories([]);
        }
      } catch (loadError) {
        console.error(loadError);
        setError("دریافت اطلاعات استوری‌ها با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateStory = (id: string, patch: Partial<HomeStory>) => {
    setStories((current) =>
      current.map((story) => (story.id === id ? { ...story, ...patch } : story)),
    );
  };

  const moveStory = (index: number, direction: -1 | 1) => {
    setStories((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  };

  const handleImageChange = async (
    storyId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingId(storyId);
    setError("");

    try {
      const response = await uploadSiteContentImage(file);
      if (response.image) {
        updateStory(storyId, { image: response.image });
      }
    } catch (uploadError) {
      console.error(uploadError);
      setError("آپلود تصویر استوری با خطا مواجه شد.");
    } finally {
      setUploadingId("");
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const items = stories.filter(
      (story) => story.image && story.title.trim() && story.slug,
    );

    if (stories.length > 0 && items.length !== stories.length) {
      setError("برای هر استوری عکس، متن و مقصد لینک را کامل کنید.");
      setSaving(false);
      return;
    }

    try {
      await updateSiteContent("stories", { items });
      addToast("استوری‌ها ذخیره شد", "success");
      router.push("/admin/contents");
      router.refresh();
    } catch (saveError) {
      console.error(saveError);
      setError("ذخیره استوری‌ها با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-neutral-500">در حال دریافت استوری‌ها...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/admin/contents"
            className="text-sm text-neutral-500 underline underline-offset-4 hover:text-black"
          >
            بازگشت به محتوای سایت
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">
            استوری‌های صفحه اصلی
          </h1>
          <p className="mt-2 text-sm leading-7 text-neutral-500">
            هر دایره یک عکس و یک متن زیر آن دارد و به محصول یا دسته‌بندی انتخابی
            شما می‌رود. در موبایل بالای عنوان هیرو و در دسکتاپ بین نوبار و هیرو
            دیده می‌شود.
          </p>
        </div>

        <FormNotice message={error} className="mb-6" />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          {stories.length === 0 ? (
            <p className="text-sm text-neutral-500">
              هنوز استوری‌ای نساخته‌اید.
            </p>
          ) : (
            stories.map((story, index) => (
              <div
                key={story.id}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">استوری {index + 1}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveStory(index, -1)}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs"
                    >
                      بالا
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStory(index, 1)}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs"
                    >
                      پایین
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStories((current) =>
                          current.filter((item) => item.id !== story.id),
                        )
                      }
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-red-600"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                  <div>
                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                      {story.image ? (
                        <img
                          src={`${API_BASE}${story.image}`}
                          alt={story.title || "استوری"}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploadingId === story.id}
                      onChange={(event) => handleImageChange(story.id, event)}
                      className="mt-3 block w-full text-xs"
                    />
                    {uploadingId === story.id ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        در حال آپلود...
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        متن زیر دایره
                      </label>
                      <input
                        type="text"
                        value={story.title}
                        onChange={(event) =>
                          updateStory(story.id, { title: event.target.value })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium">لینک به</p>
                      <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={story.linkType === "product"}
                            onChange={() =>
                              updateStory(story.id, {
                                linkType: "product",
                                slug: "",
                              })
                            }
                          />
                          محصول
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={story.linkType === "category"}
                            onChange={() =>
                              updateStory(story.id, {
                                linkType: "category",
                                slug: "",
                              })
                            }
                          />
                          دسته‌بندی
                        </label>
                      </div>
                    </div>

                    {story.linkType === "product" ? (
                      <select
                        value={story.slug}
                        onChange={(event) =>
                          updateStory(story.id, { slug: event.target.value })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                      >
                        <option value="">انتخاب محصول</option>
                        {products.map((product) => (
                          <option key={product._id} value={product.slug}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={story.slug}
                        onChange={(event) =>
                          updateStory(story.id, { slug: event.target.value })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                      >
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() => setStories((current) => [...current, newStory()])}
            className="rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            افزودن استوری
          </button>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
            <button
              type="button"
              onClick={() => router.push("/admin/contents")}
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving || Boolean(uploadingId)}
              className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ذخیره استوری‌ها"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
