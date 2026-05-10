/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const parsedApiUrl = new URL(apiUrl);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.ahmfragrances.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
