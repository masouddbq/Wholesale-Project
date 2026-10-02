import type { Metadata } from "next";

import CmsTextPage from "@/components/CmsTextPage";

export const metadata: Metadata = {
  title: "قوانین و شرایط سفارش",
};

export default function TermsPage() {
  return (
    <CmsTextPage contentKey="terms" eyebrow="اطلاعات فروشگاه" />
  );
}
