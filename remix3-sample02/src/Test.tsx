import { type Handle, on } from "remix/ui";

export function Test(handle: Handle) {
  let mouseState = "mouseOut";
  return ({ value }: { value: string }) => (
    <div
      mix={[
        on("mouseover", () => {
          mouseState = "mouseOver";
          handle.update();
        }),
        on("mouseout", () => {
          mouseState = "mouseOut";
          handle.update();
        }),
      ]}
    >
      {value}:{mouseState}
    </div>
  );
}
