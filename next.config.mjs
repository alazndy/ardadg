/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*', 
        destination: 'http://localhost:3000/:path*'
      }
    ]
  }
};

export default nextConfig;
