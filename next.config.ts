import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/customers", permanent: false }];
  },
};

export default nextConfig;
