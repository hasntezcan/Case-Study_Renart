import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.scss";
import "@/app/font.css";

const avenirBook = localFont({
  variable: "--font-avenir",
  display: "swap",
  src: [{ path: "../public/Fonts/avenir/Avenir-Book.ttf", weight: "400", style: "normal" }],
});

const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [
    { path: "../public/Fonts/montserat/Montserrat-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/Fonts/montserat/Montserrat-Medium.otf", weight: "500", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Jewelry Products",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${montserrat.variable} ${avenirBook.variable}`}>
        {children}
      </body>
    </html>
  );
}
