import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TERRALIGN — Where Earth Meets Other Worlds",
  description:
    "Planetary analog intelligence platform for lunar and Martian surface exploration mission planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-space-bg text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

