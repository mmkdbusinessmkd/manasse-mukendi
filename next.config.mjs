/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Keep the testimonial visible, but exclude its portrait from image search.
    return ['/images/peter-ngoyi-portrait.jpg', '/images/peter-ngoyi.png'].map(source => ({
      source, headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }));
  },
};
export default nextConfig;
