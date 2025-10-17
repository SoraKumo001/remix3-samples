# remix3-sample01

https://sorakumo001.github.io/remix3-sample01/

```tsx
import { createRoot, type Remix } from "@remix-run/dom";
import { press } from "@remix-run/events/press";

function App(this: Remix.Handle) {
  let count = 0;
  return () => (
    <button
      on={press(() => {
        count++;
        this.render();
      })}
    >
      Count: {count}
    </button>
  );
}

createRoot(document.body).render(<App />);
```
