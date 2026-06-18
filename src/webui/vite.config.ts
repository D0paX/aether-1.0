import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path, { resolve } from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        ...(mode === "development" ? {
          "/window_controls.mojom-webui.js": path.resolve(__dirname, "./src/chrome/services/stubs/window_controls.mojom-webui.ts"),
          "/tab_manager.mojom-webui.js": path.resolve(__dirname, "./src/chrome/services/stubs/tab_manager.mojom-webui.ts"),
          "/navigation.mojom-webui.js": path.resolve(__dirname, "./src/chrome/services/stubs/navigation.mojom-webui.ts"),
        } : {}),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        input: {
          chrome: resolve(__dirname, "index.html"),
          newtab: resolve(__dirname, "newtab.html"),
        },
        external: [
          "/window_controls.mojom-webui.js",
          "/tab_manager.mojom-webui.js",
          "/navigation.mojom-webui.js",
        ],
        output: {
          entryFileNames: "assets/[name]/[name].[hash].js",
          chunkFileNames: "assets/shared/[name].[hash].js",
          assetFileNames: "assets/[name].[hash][extname]",
        },
      },
    },
    server: {
      port: 5173,
    },
    // Define global constants evaluated at build time for dead code elimination.
    define: {
      __AETHER_DEV__: mode === "development",
    },
  };
});
