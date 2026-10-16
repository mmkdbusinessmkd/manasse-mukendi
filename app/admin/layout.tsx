import type { Metadata, Viewport } from 'next';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Espace privé | Manassé Mukendi',
  description: 'Gestion freelance privée.',
  applicationName: 'Mon activité — Manassé Mukendi',
  manifest: '/mon-activite.webmanifest',
  appleWebApp: { capable: true, title: 'Mon activité', statusBarStyle: 'default' },
  icons: { icon: '/images/brand/app-192.png', apple: '/images/brand/app-192.png' },
  robots: { index: false, follow: false, nocache: true },
  alternates: {}, openGraph: {}, twitter: {},
};
export const viewport: Viewport = { themeColor: '#103f28', width: 'device-width', initialScale: 1 };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}
