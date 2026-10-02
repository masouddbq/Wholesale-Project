"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  getSiteContent,
  PAGE_CONTENT_FALLBACKS,
  updateSiteContent,
} from "@/services/siteContentService";
import FormNotice from "@/components/FormNotice";

export default function EditSiteContentPage() {
  const router = useRouter();
  const params = useParams<{ key: string }>();
  const key = decodeURIComponent(params.key || "");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (key === "hero") {
      router.replace("/admin/contents/hero/edit");
      return;
    }

    if (key === "stories") {
      router.replace("/admin/contents/stories/edit");
      return;
    }

    if (key === "footer") {
      router.replace("/admin/contents/footer/edit");
      return;
    }

    const loadContent = async () => {
      const fallback = PAGE_CONTENT_FALLBACKS[key];

      try {
        const response = await getSiteContent(key);
        const data = response.content.data || {};

        setTitle(
          typeof data.title === "string" && data.title
            ? data.title
            : fallback?.title || ""
        );
        setContent(
          typeof data.content === "string" && data.content
            ? data.content
            : fallback?.content || ""
        );
      } catch {
        setTitle(fallback?.title || "");
        setContent(fallback?.content || "");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [key, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await updateSiteContent(key, { title, content });
      router.push("/admin/contents");
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "ذخیره محتوا با خطا مواجه شد."
      );
    } finally {
      setIsSubmitting(false);
    }
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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">ویرایش محتوا</h1>
        <p className="mt-1 text-sm text-neutral-500" dir="ltr">
          {key}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            عنوان
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none focus:border-[var(--accent)] focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            متن
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={12}
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none focus:border-[var(--accent)] focus:bg-white"
          />
        </div>

        <FormNotice message={error} />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary-glow rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
          </button>

          <Link
            href="/admin/contents"
            className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold"
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  );
}
