import { getContentBySlug } from "@/services/siteContentService";
import { notFound } from "next/navigation";

export default async function AboutPage() {
  try {
    const data = await getContentBySlug("about");

    const content = data.content;

    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10">
          <p className="text-sm text-neutral-500">
            درباره فروشگاه
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            {content.title}
          </h1>
        </div>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-10">
          <div className="whitespace-pre-line text-base leading-9 text-neutral-600 md:text-lg">
            {content.content}
          </div>
        </section>
      </main>
    );
  } catch {
    notFound();
  }
}