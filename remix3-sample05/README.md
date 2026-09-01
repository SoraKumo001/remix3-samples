# Remix 3 Sample 05

A sample project for Remix 3 (vDOM) demonstrating Server-Side Rendering (SSR), path-based routing with `RouterProvider`, async UI streaming via `<Frame>`, and weather forecast data fetching from the Open-Meteo API.

---

## Features

- **Remix 3 Streaming & Frames**: Streams the document shell and async weather data without blocking the initial render.
- **Client Runtime (`run()`)**: Uses Remix 3's `run()` runtime for progressive enhancement, frame navigation, and hydration.
- **Hono + Vite Integration**: High-performance SSR handler with Vite development server and Rolldown client bundling.

---

## Project Structure

- **src/server.tsx**: Hono entry point streaming the server-rendered `<Layout>` with initial route storage.
- **src/root.tsx**: Document shell wrapping `<SSRProvider>` and `<App>`.
- **src/client.tsx**: Client-side entry initializing `run()`.
- **src/provider/RouterProvider.tsx**: Path matching and navigation context using `@remix-run/route-pattern`.
- **src/components/Weather.tsx**: Async weather forecast component fetching from Open-Meteo.

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

### Start Production Server

```sh
pnpm start
```
