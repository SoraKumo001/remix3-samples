# Remix 3 Sample 06

A full-featured sample project for Remix 3 (vDOM) with file-based routing, Tailwind CSS, and Cloudflare Workers deployment.

[Live Demo](https://remix3-sample06.mofon001.workers.dev/)

---

## Features

- **File-Based Routing**: Auto-generated route tree from `src/routes/` directory via custom Vite plugin (`vite-plugin/remix-routes`).
- **Edge Deployment**: Optimized for Cloudflare Workers with `@hono/vite-dev-server` and Wrangler.
- **Tailwind CSS v4**: Built-in modern styling with `@tailwindcss/vite`.
- **Selective Hydration & Frames**: Streaming SSR and client-side Frame navigation with `run()`.

---

## Project Structure

- **worker/app.ts**: Cloudflare Worker entry point using Hono.
- **vite-plugin/remix-routes.ts**: Custom Vite plugin generating file-based route definitions.
- **src/routes/**: Directory for file-based route components (e.g., `index.tsx`, `city/$name.tsx`).
- **src/root.tsx**: Document shell wrapping `<SSRProvider>` and `<App>`.
- **src/client.tsx**: Client-side entry initializing Remix 3 `run()`.

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
