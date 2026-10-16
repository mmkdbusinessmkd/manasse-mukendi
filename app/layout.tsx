import type { Metadata } from "next";
import PublicAnalytics from "./components/PublicAnalytics";
import "./globals.css";
import "./identity.css";
import "./polish.css";
import "./mobile.css";
import "./clarity.css";
import "./brand-textures.css";
import "./mobile-refinements.css";
import "./site-layout.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.manasse-mukendi.com"),
  title: "Manassé Mukendi / Marketing et Communication Digitale",
  description: "Manassé Mukendi accompagne votre entreprise : stratégie de communication digitale, création de contenus et gestion des réseaux sociaux, en RDC et à l’international.",
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
    title: "Manassé Mukendi / Marketing et Communication Digitale",
    description: "Une direction claire pour votre communication, des contenus pour votre offre et un pilotage de vos réseaux sociaux. Découvrez mes réalisations et parlons de votre projet.",
  },
  twitter: {
    card: "summary",
    title: "Manassé Mukendi / Marketing et Communication Digitale",
    description: "Une direction claire pour votre communication, des contenus pour votre offre et un pilotage de vos réseaux sociaux. Découvrez mes réalisations et parlons de votre projet.",
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
  return <html lang="fr"><body>{children}<PublicAnalytics /></body></html>;
}
