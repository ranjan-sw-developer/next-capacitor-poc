/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // ✅ enable static export
  images: {
    domains: ["via.placeholder.com", "placehold.co"], // ✅ allow JSONPlaceholder images
  },
};

export default nextConfig;
