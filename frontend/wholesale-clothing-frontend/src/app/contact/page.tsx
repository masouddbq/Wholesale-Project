import type { Metadata } from "next";

import CmsTextPage from "@/components/CmsTextPage";
import StoreMap from "@/components/StoreMap";
import { getSiteContent } from "@/services/siteContentService";
import { parseFooterContent } from "@/lib/footerContent";

export const metadata: Metadata = {
  title: "ارتباط با ما",
};

export default async function ContactPage() {
  let footer = parseFooterContent();

  try {
    const response = await getSiteContent("footer");
    footer = parseFooterContent(response.content?.data || {});
  } catch {
    footer = parseFooterContent();
  }

  return (
    <>
      <CmsTextPage contentKey="contact" eyebrow="ارتباط با ما" />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        {footer.mapAddress && (
          <p className="mb-3 text-sm text-neutral-600">{footer.mapAddress}</p>
        )}
        <StoreMap
          lat={footer.mapLat}
          lng={footer.mapLng}
          className="overflow-hidden rounded-xl border border-neutral-200"
          tone="light"
        />
      </div>
    </>
  );
}
