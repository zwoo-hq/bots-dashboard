// Plugins
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
      script: {
        defineModel: true,
      },
    }),
    vuetify({
      autoImport: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3003,
  },
  build: {
    outDir: "../cmd/dist",
    emptyOutDir: true,
  },
});
