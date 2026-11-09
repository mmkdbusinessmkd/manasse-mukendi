/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Keep testimonial and legacy assets available, but only index the current owner portrait.
    return [
      '/images/peter-ngoyi-portrait.jpg', '/images/peter-ngoyi.png',
      '/images/manasse-portrait-2026.png', '/images/manasse-consultant.webp',
      '/images/manasse-marketing.jpg', '/images/manasse-mukendi-portrait-2026-10.jpg',
      '/images/manasse-mukendi-cutout-v1.png', '/images/manasse-mukendi-accueil-sans-fond.png',
    ].map(source => ({
      source, headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }));
  },
};
export default nextConfig;
