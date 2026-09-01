# Remix 3 Sample 08

A sample project for Remix 3 (vDOM) demonstrating file-based routing and automatic server data loaders (`DataLoader`), deployed to Cloudflare Workers.

[Live Demo](https://remix3-sample08.mofon001.workers.dev/)

---

## Features

- **Automatic Data Loaders**: Routes define static or instance `load()` methods to fetch data on the server before rendering.
- **File-Based Routing**: Auto-generated route tree with parameter extraction (e.g. `city/$name.tsx`) and loader integration.
- **Selective Hydration & Frames**: Out-of-order streaming SSR and client-side Frame navigation with `run()`.
- **Tailwind CSS v4 & Cloudflare Workers**: Modern responsive UI on edge infrastructure.

---

## Project Structure

- **worker/app.ts**: Cloudflare Worker entry point using Hono.
- **src/routes/city/$name.tsx**: Dynamic route component with async `load()` function for weather data.
- **src/provider/RouterProvider.tsx**: Router provider handling route resolution, parameter injection, and loader execution.
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
