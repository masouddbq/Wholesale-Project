import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <html lang="fa" dir="rtl">
      <body>
        <Navbar />

        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}