import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manassé Mukendi | Communication digitale",
  description: "Community Manager, Social Media Manager et Marketeur Digital basé à Kinshasa.",
  verification: {
    google: "HPnEqhNTn-Gvo1mGxdYjqne7XHMykMDPJNV3WtdGxYM",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
