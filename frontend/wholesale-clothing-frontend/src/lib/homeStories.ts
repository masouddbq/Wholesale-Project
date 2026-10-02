import { getSiteContent } from "@/services/siteContentService";

export type HomeStory = {
  id: string;
  image: string;
  title: string;
  linkType: "product" | "category";
  slug: string;
};

export const storyHref = (story: HomeStory) =>
  story.linkType === "category"
    ? `/categories/${story.slug}`
    : `/products/${story.slug}`;

export const loadHomeStories = async (): Promise<HomeStory[]> => {
  try {
    const response = await getSiteContent("stories");
    const rawItems = response.content?.data?.items;

    if (!Array.isArray(rawItems)) {
      return [];
    }

    return rawItems
      .map((item: Record<string, unknown>, index: number) => {
        const linkType =
          item.linkType === "category" ? "category" : "product";
        const slug = String(item.slug || "").trim();
        const image = String(item.image || "").trim();
        const title = String(item.title || "").trim();

        if (!image || !title || !slug) {
          return null;
        }

        return {
          id: String(item.id || `story-${index}`),
          image,
          title,
          linkType,
          slug,
        } satisfies HomeStory;
      })
      .filter((item): item is HomeStory => Boolean(item));
  } catch {
    return [];
  }
};
