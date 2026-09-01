# Remix 3 Sample 07

An interactive image optimization tool built with Remix 3 (vDOM), WebAssembly (`wasm-image-optimization`), Web Workers, and Tailwind CSS, deployed to Cloudflare Workers.

[Live Demo](https://remix3-sample07.mofon001.workers.dev/)

---

## Features

- **WASM Image Optimization**: Converts and compresses images (AVIF, WebP, JPEG, PNG) client-side using WebAssembly.
- **Web Worker Parallel Processing**: Uses `wasm-image-optimization/workers` for non-blocking multi-threaded processing.
- **Remix 3 `clientEntry`**: Marks the interactive `Page` component with `clientEntry` for selective hydration, leaving the surrounding document shell static.
- **Tailwind CSS v4 & Cloudflare Workers**: Modern UI styling and edge deployment support.

---

## Project Structure

- **src/routes/index.tsx**: Main image optimization interface wrapped in `clientEntry`.
- **src/client.tsx**: Client runtime with dynamic module loading via `import.meta.glob` and `run()`.
- **worker/app.ts**: Cloudflare Worker / Hono entry point for server-side rendering.
- **vite.config.ts**: Vite build and plugin configuration.

---

## Commands

### Start Development Server

```sh
pnpm dev
```

### Production Build

```sh
pnpm build
```

### Deploy to Cloudflare Workers

```sh
pnpm deploy
```
