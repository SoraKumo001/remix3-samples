# Remix 3 Samples

A collection of sample applications demonstrating the features and architecture of [Remix 3](https://github.com/remix-run/remix) (JSX/vDOM, Progressive Enhancement, Out-of-Order Streaming, Selective Hydration with `run()`, File-Based Routing, and Cloudflare Workers).

---

## Samples Overview

- **[remix3-sample01](./remix3-sample01)**: Simple SPA (Standalone client-side counter using `createRoot` and Rolldown)
- **[remix3-sample02](./remix3-sample02)**: SPA on Vite (Client-side rendering on Vite dev server)
- **[remix3-sample03](./remix3-sample03)**: Simple SSR with Hono & Rolldown (Server-side rendering with `renderToStream` and client `run()` runtime)
- **[remix3-sample04](./remix3-sample04)**: SSR on Vite & Hono (SSR with Vite dev server and `run()` runtime)
- **[remix3-sample05](./remix3-sample05)**: Weather Forecast (SSR + Path-based Routing + Open-Meteo API)
- **[remix3-sample06](./remix3-sample06)**: Weather Forecast on Edge (SSR + File-based Routing + Tailwind CSS + Cloudflare Workers)
- **[remix3-sample07](./remix3-sample07)**: Image Optimization Tool (`wasm-image-optimization` + Web Workers + `clientEntry` Selective Hydration + Cloudflare Workers)
- **[remix3-sample08](./remix3-sample08)**: Weather Forecast with Data Loaders (SSR + File-based Routing + Automatic Server Data Loader + Cloudflare Workers)

---

## Getting Started

### Install Dependencies

```sh
pnpm install
```

### Build All Samples

```sh
pnpm -r build
```
