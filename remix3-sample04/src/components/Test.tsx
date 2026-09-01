import { type Handle, on } from "remix/ui";

export function Test(handle: Handle<{ value: string }>) {
  let mouseState = "mouseOut";
  return () => (
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
      {handle.props.value}:{mouseState}
    </div>
  );
}
