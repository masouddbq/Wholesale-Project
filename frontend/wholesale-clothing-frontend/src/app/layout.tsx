import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthInitializer from "@/components/authInitializer";
import BottomNav from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AM-Clothing | فروشگاه عمده پوشاک",
    template: "%s | AM-Clothing",
  },
  description:
    "فروشگاه عمده فروشی پوشاک مردانه و زنانه - تأمین مستقیم پوشاک عمده برای فروشگاه‌ها و کسب‌وکارها با بهترین قیمت و کیفیت",
  keywords: [
    "پوشاک عمده",
    "عمده فروشی پوشاک",
    "فروشگاه عمده",
    "پوشاک مردانه",
    "پوشاک زنانه",
    "تیشرت عمده",
    "هودی عمده",
  ],
  authors: [{ name: "AM-Clothing" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "AM-Clothing",
    title: "AM-Clothing | فروشگاه عمده پوشاک",
    description:
      "فروشگاه عمده فروشی پوشاک مردانه و زنانه - تأمین مستقیم پوشاک عمده برای فروشگاه‌ها",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
    >
      <body>
        <ToastProvider>
          <AuthInitializer />

          <Navbar />

          <main>{children}</main>

          <BottomNav />

          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
