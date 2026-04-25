/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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
    ],
  },
};

export default nextConfig;
