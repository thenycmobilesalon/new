import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageReveal from "@/components/PageReveal";
import ScrollReveal from "@/components/ScrollReveal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "The NYC Mobile Salon — Beauty Services Delivered to Your Door",
    template: "%s | The NYC Mobile Salon",
  },
  description:
    "Licensed beauty professionals come to you anywhere in NYC. Hair, nails, makeup, grooming & more across all 5 boroughs. Book your in-home appointment today.",
  openGraph: {
    title: "The NYC Mobile Salon — Beauty Services Delivered to Your Door",
    description:
      "Licensed beauty professionals come to you anywhere in NYC. Hair, nails, makeup, grooming & more across all 5 boroughs.",
    type: "website",
    url: "https://thenycmobilesalon.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${playfair.variable} antialiased`}>
        <PageReveal />
        <ScrollReveal />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
