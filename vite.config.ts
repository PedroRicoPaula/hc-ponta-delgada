import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Serve /calendario/<escalão>.ics no `npm run dev`, gerado na hora a partir de
// games[]. No build quem escreve os ficheiros é o scripts/prerender.js.
const icsFeeds = (): Plugin => ({
  name: "ics-feeds",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const slug = req.url?.match(/^\/calendario\/([\w-]+)\.ics(?:\?|$)/)?.[1];
      if (!slug) return next();
      try {
        const { renderFeed } = await server.ssrLoadModule("/src/lib/ics.ts");
        const body = renderFeed(slug);
        if (!body) return next();
        res.setHeader("Content-Type", "text/calendar; charset=utf-8");
        res.end(body);
      } catch (err) {
        next(err);
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    icsFeeds(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["framer-motion"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "recharts",
      "@tanstack/react-query",
      "react-hook-form",
      "@hookform/resolvers/zod",
      "zod",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "react-helmet-async",
    ],
  },
}));
