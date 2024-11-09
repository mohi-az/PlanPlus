import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental:{
  //   ppr:'incremental'
  // },
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"avatars.githubusercontent.com"
      }
    ]
  }
};

export default nextConfig;
