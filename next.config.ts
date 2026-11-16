import type { NextConfig } from "next";

// Two builds from one codebase:
//   `next build`                      static export → out/ (GitHub Pages at sheng-yan.com; no server, so the
//                                     note card falls back to the visitor's mail app)
//   `NEXT_OUTPUT=standalone next build` Node server with the note API (src/app/api/note/route.node.ts),
//                                     which only counts as a route when "node.ts" is a page extension.
const standalone = process.env.NEXT_OUTPUT === "standalone";

const nextConfig: NextConfig = {
  output: standalone ? "standalone" : "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: standalone ? ["node.ts", "tsx", "ts"] : ["tsx", "ts"],
};

export default nextConfig;
