import { run } from "remix/ui";

const modules = import.meta.glob("./**/*.tsx");

const app = run({
  async loadModule(moduleUrl, exportName) {
    const cleanUrl = moduleUrl.startsWith("/src/")
      ? `.${moduleUrl.slice(4)}`
      : moduleUrl;
    const loader = modules[cleanUrl] ?? modules[moduleUrl];
    if (loader) {
      const mod: any = await loader();
      return mod[exportName];
    }
    const mod = await import(/* @vite-ignore */ moduleUrl);
    return mod[exportName];
  },
});

await app.ready();

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
}
