import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Mulika Ufisadi",
        short_name: "Mulika",
        description: "Anonymous Corruption Reporting Platform",
        theme_color: "#4A90E2",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "map-vendor": ["react-map-gl", "mapbox-gl"],
          "chart-vendor": ["recharts"],
          "ml-vendor": ["@tensorflow/tfjs"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
