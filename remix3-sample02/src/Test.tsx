import { type Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";

export function Test(this: Remix.Handle) {
  let mouseState = "mouseOut";
  return ({ value }: { value: string }) => (
    <div
      on={[
        dom.mouseover(() => {
          mouseState = "mouseOver";
          this.render();
        }),
        dom.mouseout(() => {
          mouseState = "mouseOut";
          this.render();
        }),
      ]}
    >
      {value}:{mouseState}
    </div>
  );
}
