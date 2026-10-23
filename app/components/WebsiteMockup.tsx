import { useId } from 'react';

/** Real screenshots fitted to the supplied device photograph, without redrawing the UI. */
export default function WebsiteMockup({ desktop, mobile, name }: { desktop: string; mobile: string; name: string }) {
  const id = useId().replace(/:/g, '');
  return <svg className="website-device-mockup" viewBox="40 240 1520 1100" role="img" aria-label={`${name} : aperçu du site sur ordinateur et téléphone`}>
    <defs>
      <clipPath id={`${id}-phone-frame`}><rect x="1230" y="750" width="282" height="568" rx="45"/></clipPath>
      <clipPath id={`${id}-phone-screen`}><path d="M1275 765H1320V775Q1320 787 1332 787H1409Q1421 787 1421 775V765H1466Q1495 765 1495 794V1273Q1495 1302 1466 1302H1275Q1246 1302 1246 1273V794Q1246 765 1275 765Z"/></clipPath>
    </defs>
    <image href="/images/projects/laptop-smartphone-mockup.jpg" width="1600" height="1600"/>
    <image href={desktop} x="254" y="340" width="1082" height="675" preserveAspectRatio="none"/>
    <image href="/images/projects/laptop-smartphone-mockup.jpg" width="1600" height="1600" clipPath={`url(#${id}-phone-frame)`}/>
    <image href={mobile} x="1246" y="765" width="249" height="537" preserveAspectRatio="none" clipPath={`url(#${id}-phone-screen)`}/>
  </svg>;
}
