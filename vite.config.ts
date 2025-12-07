import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 8080,
      middlewareMode: mode === "ssr",
      watch: {
        // Exclude deployment and config files from watch to prevent restart issues
        ignored: [
          "**/node_modules/**",
          "**/dist/**",
          "**/.git/**",
          "**/netlify.toml",
          "**/vercel.json",
          "**/.env*",
          "**/DEPLOYMENT*.md",
          "**/env.example.txt",
        ],
      },
    },
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
    build: {
      outDir: "dist/spa",
      sourcemap: false, // Disable source maps in production for smaller bundle
      minify: "esbuild", // Fast minification
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            ui: ["@radix-ui/react-dialog", "@radix-ui/react-popover", "@radix-ui/react-toast"],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // Warn if chunks exceed 1MB
    },
    plugins: [react(), expressPlugin()],
  };
});

function expressPlugin(): Plugin {
  let expressApp: ReturnType<typeof createServer> | null = null;

  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      // Create Express app once and reuse it
      expressApp = createServer();
      server.middlewares.use(expressApp);
    },
  };
}
