import { type Remix } from "@remix-run/dom";
import { press } from "@remix-run/events/press";
import { Test } from "./Test";

export function App(this: Remix.Handle) {
  let count = 0;

  return () => (
    <>
      <button
        on={[
          press(() => {
            count++;
            this.render();
          }),
        ]}
      >
        Count: {count}
      </button>
      <Test value="test" />
    </>
  );
}
