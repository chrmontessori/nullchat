/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.STATIC_EXPORT === "1" ? { output: "export" } : {}),
  turbopack: {},
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "connect-src 'self' wss://ws.nullchat.org wss://localhost:* ws://localhost:*",
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self'",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          {
            key: "Onion-Location",
            value: "http://5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion",
          },
          {
            key: "Alt-Svc",
            value: 'h2="5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion:80"; ma=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
