# Remix 3 Sample 04

A web application environment using Remix 3 (vDOM), Hono, Vite, and Rolldown.

## Project Structure

### Server & Build Environment
- **vite.config.ts**: Vite and `@hono/vite-dev-server` configuration. Includes `@hono/vite-build` for production builds.
- **rolldown.config.ts**: Rolldown configuration for client-side JavaScript (`public/bundle.js`) bundling.
- **src/server.tsx**: Entry point for Hono production and development servers. HTML is streamed using `renderToStream` from `remix/ui/server`.

### Client & UI Components
- **src/root.tsx**: Root component defining the document shell (`<html>`, `<head>`, `<body>`).
- **src/client.tsx**: Client-side hydration entry point. Implements `root.dispose()` via `import.meta.hot.dispose` to prevent memory leaks and double-rendering during HMR.
- **src/components/**: Directory for UI components.
  - Remix 3 components receive a `handle` object as the first argument; use `handle.update()` to trigger state updates.

---

## Commands

### Start Development Server
```sh
pnpm dev
```
Starts the development server with Vite and Hono.

### Production Build
```sh
pnpm build
```
Builds the server with Vite and bundles the client code with Rolldown. Outputs to `dist/` and `public/bundle.js`.

### Start Production Server
```sh
pnpm start
```
Runs the production server from the `dist/` directory.

### Type Check
```sh
pnpm typecheck
```
Runs TypeScript static type checking.
