/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://85.214.142.178:9010/auth/:path*'
      },
      {
        source: '/api/vm-manager/:path*',
        destination: 'http://85.214.142.178:9010/vm-manager/:path*'
      },
      
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  }
}

module.exports = nextConfig
