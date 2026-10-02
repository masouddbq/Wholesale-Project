import type { Metadata } from "next";

import CmsTextPage from "@/components/CmsTextPage";

export const metadata: Metadata = {
  title: "راهنمای خرید عمده",
};

export default function WholesaleGuidePage() {
  return (
    <CmsTextPage
      contentKey="wholesale-guide"
      eyebrow="راهنمای مشتریان"
    />
  );
}
