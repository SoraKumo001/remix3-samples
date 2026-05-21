import { createRoot } from "remix/ui";
import { App } from "./App";

if (document.body) {
  createRoot(document.body).render(<App />);
} else {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      createRoot(document.body).render(<App />);
    },
    { once: true }
  );
}
