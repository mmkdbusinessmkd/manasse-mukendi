import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./identity.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.manasse-mukendi.com"),
  title: "Marketing et communication digitale | Manassé Mukendi",
  description: "Consultant en marketing et communication digitale et Social Media Manager à Kinshasa. J’aide les entreprises à structurer leur image, leur stratégie et leur présence en ligne.",
  keywords: ["marketing et communication digitale", "marketing digital Kinshasa", "consultant en communication digitale", "Social Media Manager", "stratégie digitale", "communication digitale RDC", "réseaux sociaux RDC"],
  applicationName: "Manassé Mukendi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: "/",
    siteName: "Manassé Mukendi",
    title: "Marketing et communication digitale | Manassé Mukendi",
    description: "Conseil, stratégie, contenus et Social Media pour construire une présence digitale plus claire, cohérente et efficace.",
  },
  twitter: {
    card: "summary",
    title: "Marketing et communication digitale | Manassé Mukendi",
    description: "Conseil, stratégie, contenus et Social Media pour construire une présence digitale plus claire, cohérente et efficace.",
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
