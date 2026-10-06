'use client';
import { Analytics } from '@vercel/analytics/next';
import { usePathname } from 'next/navigation';

export default function PublicAnalytics() {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  return <Analytics beforeSend={event => {
    const path = new URL(event.url).pathname;
    return path === '/admin' || path.startsWith('/admin/') ? null : event;
  }} />;
}
