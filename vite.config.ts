/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

import React from "@vitejs/plugin-react";
import dts from 'vite-plugin-dts';

const packageJson = JSON.parse(
  readFileSync("./package.json", { encoding: "utf-8" })
);
const globals = {
  ...(packageJson?.dependencies || {}),
};
//@ts-ignore
import nlsPlugin, { Languages,esbuildPluginMonacoEditorNls } from './vite-plugins/nls.js'

import zh_hans from './vite-plugins/zh-hans.json'

const plugins = [React(),dts()]
// 注意只在生产环境下添加rollup插件，开发模式下会报错

if (process.env.NODE_ENV !== 'development') {
    plugins.push(nlsPlugin({
        locale: Languages.zh_hans,
        localeData: zh_hans,
    }))
}


export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "sql-editor",
      fileName: "index",
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
   plugins,
   optimizeDeps: {
    esbuildOptions: {
      plugins: [
        // 开发环境下通过esbuild插件进行汉化
        esbuildPluginMonacoEditorNls({
          locale: Languages.zh_hans,
          localeData: zh_hans,
        }),
      ],
    },
  },
});
