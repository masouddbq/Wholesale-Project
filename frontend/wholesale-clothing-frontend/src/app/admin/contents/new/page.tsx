"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { updateSiteContent } from "@/services/siteContentService";
import FormNotice from "@/components/FormNotice";

const CONTENT_KEYS = [
  { value: "about", label: "درباره ما" },
  { value: "contact", label: "ارتباط با ما" },
  { value: "terms", label: "قوانین و شرایط سفارش" },
  { value: "wholesale-guide", label: "راهنمای خرید عمده" },
];

export default function NewSiteContentPage() {
  const router = useRouter();

  const [key, setKey] = useState("about");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">افزودن محتوا</h1>
        <p className="mt-1 text-sm text-neutral-500">
          متن صفحات درباره ما، ارتباط با ما، قوانین و راهنمای خرید را وارد کنید.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <div>
          <label htmlFor="key" className="mb-2 block text-sm font-medium">
            بخش
          </label>
          <select
            id="key"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 outline-none focus:border-[var(--accent)] focus:bg-white"
          >
            {CONTENT_KEYS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

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
