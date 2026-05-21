# remix3-sample01

https://sorakumo001.github.io/remix3-sample01/

```tsx
import { createRoot, type Handle, on } from "remix/ui";

function App(handle: Handle) {
  let count = 0;
  return () => (
    <button
      mix={[
        on("click", () => {
          count++;
          handle.update();
        }),
      ]}
    >
      Count: {count}
    </button>
  );
}

if (document.body) {
  createRoot(document.body).render(<App />);
} else {
  window.addEventListener("DOMContentLoaded", () => {
    createRoot(document.body).render(<App />);
  }, { once: true });
}
```
