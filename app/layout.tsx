import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./identity.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.manasse-mukendi.com"),
  title: "manassé mukendi / marketing et communication digitale",
  description: "Consultant en marketing et communication digitale, mobile et disponible pour des projets en Afrique et à l’international. Stratégie, contenus et Social Media.",
  keywords: ["marketing et communication digitale", "consultant en communication digitale international", "marketing digital Afrique", "marketing digital Kinshasa", "Social Media Manager", "stratégie digitale", "communication digitale RDC"],
  applicationName: "Manassé Mukendi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: "/",
    siteName: "Manassé Mukendi",
    title: "manassé mukendi / marketing et communication digitale",
    description: "Conseil, stratégie, contenus et Social Media pour des entreprises en RDC, en Afrique et à l’international.",
  },
  twitter: {
    card: "summary",
    title: "manassé mukendi / marketing et communication digitale",
    description: "Conseil, stratégie, contenus et Social Media pour des entreprises en RDC, en Afrique et à l’international.",
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
