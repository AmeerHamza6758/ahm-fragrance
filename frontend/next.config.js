/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const parsedApiUrl = new URL(apiUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: parsedApiUrl.protocol.replace(":", ""),
        hostname: parsedApiUrl.hostname,
        port: parsedApiUrl.port || "",
        pathname: "/**",
      },
      // Production backend (explicit allow-list)
      {
        protocol: "https",
        hostname: "api.ahmfragrances.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
