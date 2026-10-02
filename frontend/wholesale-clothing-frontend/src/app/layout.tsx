import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthInitializer from "@/components/authInitializer";
import BottomNav from "@/components/BottomNav";
import DesktopQuickNav from "@/components/DesktopQuickNav";
import { ToastProvider } from "@/components/Toast";

import "./globals.css";

export const dynamic = "force-dynamic";

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
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("am-theme")==="dark"){var r=document.documentElement;r.classList.add("dark");r.style.setProperty("--background","#121212");r.style.setProperty("--foreground","#f3f3f3");r.style.setProperty("--surface","#1b1b1b");r.style.setProperty("--mutedbg","#242424");r.style.setProperty("--text-primary","#f3f3f3");r.style.setProperty("--text-secondary","#c8c8c8");r.style.setProperty("--text-muted","#9a9a9a");r.style.setProperty("--border","#2f2f2f");r.style.setProperty("--border-strong","#424242")}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ToastProvider>
          <AuthInitializer />

          <Navbar />

          <DesktopQuickNav />

          <main>{children}</main>

          <BottomNav />

          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
