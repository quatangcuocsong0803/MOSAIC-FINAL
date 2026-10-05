import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cho phép next/image tải ảnh từ Supabase Storage (bucket public "mosaic-media")
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Ảnh đại diện mặc định từ Clerk
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
