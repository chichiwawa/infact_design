import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // 같은 공유기(와이파이)의 다른 기기(폰·다른 PC)에서 `npm run dev` 화면을 볼 수 있게 허용 (개발 서버에서만 적용)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
