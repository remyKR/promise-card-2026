import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promise Card — Thiệp cưới điện tử",
  description: "Tạo thiệp cưới điện tử đẹp, nhanh chóng và chia sẻ dễ dàng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
