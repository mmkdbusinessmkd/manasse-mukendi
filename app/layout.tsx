import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manassé Mukendi | Communication digitale",
  description: "Community Manager, Social Media Manager et Marketeur Digital basé à Kinshasa.",
  verification: {
    google: "4d_ZXQs7PN55JeZ_tB2xVSSPkjddHri67WOEBsxviEo",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
