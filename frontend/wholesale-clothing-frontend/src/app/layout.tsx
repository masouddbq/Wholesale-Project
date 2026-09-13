import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthInitializer from "@/components/authInitializer";

import "./globals.css";

export const metadata: Metadata = {
  title: "Wholesale Clothing",
  description: "فروشگاه عمده پوشاک",
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
        <AuthInitializer />

        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
