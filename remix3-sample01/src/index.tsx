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
