/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Keep testimonial and legacy assets available, but only index the current owner portrait.
    return [
      '/images/peter-ngoyi-portrait.jpg', '/images/peter-ngoyi.png',
      '/images/manasse-portrait-2026.png', '/images/manasse-consultant.webp',
      '/images/manasse-marketing.jpg',
    ].map(source => ({
      source, headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }));
  },
};
export default nextConfig;
