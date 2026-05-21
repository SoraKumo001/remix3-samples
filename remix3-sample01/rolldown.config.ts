import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.tsx",
  output: {
    file: "public/bundle.js",
  },
});
