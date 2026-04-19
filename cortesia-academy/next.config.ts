import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "pnzdequwgjdcjvqdxfqr.supabase.co" }
    ]
  }
};

export default nextConfig;
