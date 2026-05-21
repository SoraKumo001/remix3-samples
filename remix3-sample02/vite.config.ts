import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "reload",
      handleHotUpdate({ server }) {
        server.moduleGraph.getModuleByUrl("/src/main.tsx").then((mod) => {
          if (mod) server.reloadModule(mod);
        });
      },
    },
  ],
  base: "./",
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'remix/ui',
  },
});
