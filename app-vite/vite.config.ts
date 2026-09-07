import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Netlify и обычный домен отдают сайт из корня; GitHub Pages — из подпути
// репозитория, для него отдельная команда: npm run build:pages.
export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/english/" : "/",
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: { outDir: "dist", sourcemap: false },
}));
