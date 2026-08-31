import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./identity.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.manasse-mukendi.com"),
  title: "Manassé Mukendi | Communication digitale",
  description: "J’aide les entreprises à structurer leur image, leur communication et leur présence digitale pour être mieux comprises, mieux perçues et mieux choisies.",
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
