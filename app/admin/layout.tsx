import type { Metadata } from 'next';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Espace privé | Manassé Mukendi',
  description: 'Gestion freelance privée.',
  robots: { index: false, follow: false, nocache: true },
  alternates: {}, openGraph: {}, twitter: {},
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}
