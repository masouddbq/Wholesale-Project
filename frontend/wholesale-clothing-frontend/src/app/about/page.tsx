import type { Metadata } from "next";

import CmsTextPage from "@/components/CmsTextPage";

export const metadata: Metadata = {
  title: "درباره ما",
};

export default function AboutPage() {
  return <CmsTextPage contentKey="about" eyebrow="درباره فروشگاه" />;
}
