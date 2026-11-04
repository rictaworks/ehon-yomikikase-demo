import path from "node:path"
import type { NextConfig } from "next"

// 静的書き出し（out/）を Workers Assets で配信する。API は同一オリジンの Worker（/api/*）が受ける。
// リポジトリ直下にも lockfile（Worker 用）があるため、ビルドのルートを web/ に固定する。
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve("."),
  },
}

export default nextConfig
