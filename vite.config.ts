import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

import React from "@vitejs/plugin-react";

const packageJson = JSON.parse(
  readFileSync("./package.json", { encoding: "utf-8" })
);
const globals = {
  ...(packageJson?.dependencies || {}),
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "sql-editor",
      fileName: "sql-editor",
      // 打包格式
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", ...Object.keys(globals)],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // 将所有 node_modules 模块打包到一个 chunk 中
            return "vendor";
          }
        },
        format: "cjs",
      },
    },
  },
  plugins: [React()],
});
