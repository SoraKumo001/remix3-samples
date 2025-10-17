import { createRoot } from "@remix-run/dom";
import { App } from "./App";
if (document.body) {
  createRoot(document.body).render(<App />);
} else {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      console.log(document.body.innerHTML);
      createRoot(document.body).render(<App />);
    },
    { once: true }
  );
}
