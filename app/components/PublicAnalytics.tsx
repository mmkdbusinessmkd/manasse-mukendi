'use client';
import { Analytics } from '@vercel/analytics/next';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function PublicAnalytics() {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  return <>
    <Script id="google-tag-manager-init" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
    </Script>
    <Script
      id="google-tag-manager"
      src="https://www.googletagmanager.com/gtm.js?id=GTM-KL8555B4"
      strategy="afterInteractive"
    />
    <Analytics beforeSend={event => {
      const path = new URL(event.url).pathname;
      return path === '/admin' || path.startsWith('/admin/') ? null : event;
    }} />
  </>;
}
