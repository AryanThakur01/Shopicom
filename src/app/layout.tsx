import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { Providers, ToasterProvider } from "@/lib/Providers";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: [
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
    "latin",
    "latin-ext",
  ],
});

export const metadata: Metadata = {
  title: "Shopicom",
  description: "Generated by create next app",
  verification: {
    google: "fzlZZKohQWgPVK2Dw4eokS7HWZMWq0UOcxhENin5o0Y",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={ubuntu.className + " bg-background text-foreground"}
        suppressHydrationWarning={true}
      >
        <Analytics />
        <ToasterProvider />
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
