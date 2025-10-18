import { createRoot } from "@remix-run/dom";
import { App } from "./components/App";
import { SSRProvider } from "./provider/SSRProvider";
import { RouterProvider } from "./provider/RouterProvider";

if (document.body) {
  createRoot(document.body).render(
    <RouterProvider url={location.toString()}>
      <SSRProvider>
        <App />
      </SSRProvider>
    </RouterProvider>
  );
} else {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      createRoot(document.body).render(
        <SSRProvider>
          <App />
        </SSRProvider>
      );
    },
    { once: true }
  );
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
}
