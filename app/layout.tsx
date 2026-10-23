import type { Metadata } from "next";
import PublicAnalytics from "./components/PublicAnalytics";
import { SITE_URL, PROFILE_IMAGE, PROFILE_IMAGE_WIDTH, PROFILE_IMAGE_HEIGHT, SITE_TITLE, SITE_DESCRIPTION } from "../lib/site-profile";
import "./globals.css";
import "./identity.css";
import "./polish.css";
import "./mobile.css";
import "./clarity.css";
import "./brand-textures.css";
import "./mobile-refinements.css";
import "./site-layout.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Manassé Mukendi",
  authors: [{ name: "Manassé Mukendi", url: SITE_URL }],
  creator: "Manassé Mukendi",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: "/",
    siteName: "Manassé Mukendi",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: PROFILE_IMAGE, width: PROFILE_IMAGE_WIDTH, height: PROFILE_IMAGE_HEIGHT, alt: "Manassé Mukendi, consultant en marketing et communication digitale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [PROFILE_IMAGE],
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
  return <html lang="fr"><head><link rel="preload" href="/fonts/manrope-latin-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}<PublicAnalytics /></body></html>;
}
