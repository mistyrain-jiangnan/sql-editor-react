/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

import React from "@vitejs/plugin-react";
import dts from 'vite-plugin-dts';
import { visualizer } from "rollup-plugin-visualizer";

const packageJson = JSON.parse(
  readFileSync("./package.json", { encoding: "utf-8" })
);

// 不需要被打包的包的黑名单
const blacklist: string[] = ['dt-sql-parser'];
const globals = Object.keys(packageJson.dependencies)
  .filter(key => !blacklist.includes(key))
  .reduce<Record<string, string>>((obj, key) => {
    obj[key] = packageJson.dependencies[key];
    return obj;
  }, {});

//@ts-ignore
import nlsPlugin, { Languages,esbuildPluginMonacoEditorNls } from './vite-plugins/nls.js'

import zh_hans from './vite-plugins/zh-hans.json'

const plugins = [React(),dts({insertTypesEntry: true}),visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
      })
]
// 注意只在生产环境下添加rollup插件，开发模式下会报错
if (process.env.NODE_ENV !== 'development') {
    plugins.push(nlsPlugin({
        locale: Languages.zh_hans,
        localeData: zh_hans,
    }))
}
console.log(...Object.keys(globals));
export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "sql-editor",
      // 打包格式
      formats: ["es", "cjs"],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs')
    },
    rollupOptions: {
      external: [...Object.keys(globals)],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "monaco-editor": "monaco-editor",
        },
         exports: 'named',
        manualChunks: (id) => {
          if (id.includes("node_modules/dt-sql-parser")) {
            return "dt-sql-parser";
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
