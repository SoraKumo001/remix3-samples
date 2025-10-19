import { createRoot } from "@remix-run/dom";
import { App } from "./App";
import { SSRProvider } from "./provider/SSRProvider";
import { RouterProvider } from "./provider/RouterProvider";

const Render = (
  <RouterProvider>
    <SSRProvider>
      <App />
    </SSRProvider>
  </RouterProvider>
);

if (document.body) {
  createRoot(document.body).render(Render);
} else {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      createRoot(document.body).render(Render);
    },
    { once: true }
  );
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
}
