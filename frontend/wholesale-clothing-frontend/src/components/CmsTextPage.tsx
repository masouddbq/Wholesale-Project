import { getPageContent } from "@/services/siteContentService";

type CmsTextPageProps = {
  contentKey: string;
  eyebrow: string;
};

export default async function CmsTextPage({
  contentKey,
  eyebrow,
}: CmsTextPageProps) {
  const content = await getPageContent(contentKey);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10">
        <p className="text-sm text-neutral-500">{eyebrow}</p>

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
}
