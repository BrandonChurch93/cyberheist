import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  root: "src",
  base: "/",

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          audio: ["howler"],
          animation: ["gsap"],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          } else if (/mp3|wav|ogg/i.test(ext)) {
            return `assets/audio/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    visualizer({
      filename: "../stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  optimizeDeps: {
    include: ["three", "gsap", "howler"],
  },
});
