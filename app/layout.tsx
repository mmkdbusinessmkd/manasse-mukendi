import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./identity.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.manasse-mukendi.com"),
  title: "Manassé Mukendi | Communication digitale",
  description: "Community Manager, Social Media Manager et Marketeur Digital basé à Kinshasa.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "4d_ZXQs7PN55JeZ_tB2xVSSPkjddHri67WOEBsxviEo",
  },
  icons: {
    icon: "/images/brand/favicon-mm.png",
    apple: "/images/brand/favicon-mm.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}<Analytics /></body></html>;
}
