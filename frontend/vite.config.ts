import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "relay",
            {
              artifactDirectory: "./src/__generated__",
            },
          ],
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-relay"],
  },
});
