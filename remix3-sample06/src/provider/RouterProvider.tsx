import { type Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";

const isServer = typeof window === "undefined";

export function RouterProvider(
  this: Remix.Handle<{
    serverUrl: string;
    navigate: (url: string) => void;
  }>
) {
  const context = {
    serverUrl: "",
    navigate: (url: string) => {
      history.pushState({}, "", url);
      this.render();
    },
  };
  this.context.set(context);

  const handlePopState = () => {
    this.render();
  };
  if (!isServer) {
    addEventListener("popstate", handlePopState);
  }
  return ({ url, children }: { url?: string; children: Remix.RemixNode }) => {
    if (isServer && url) {
      context.serverUrl = url;
    }
    return <>{children}</>;
  };
}

export const useLocation = (inst: Remix.Handle) => {
  if (isServer) {
    const url = new URL(inst.context.get(RouterProvider).serverUrl);
    return url.pathname;
  }
  return location.pathname;
};

export const useNavigate = (inst: Remix.Handle) => {
  return inst.context.get(RouterProvider).navigate;
};

export function Link(this: Remix.Handle) {
  const navigate = useNavigate(this);
  return (props: Remix.Props<"a">) => {
    return (
      <a
        {...props}
        on={dom.click((e) => {
          e.preventDefault();
          if (props.href) {
            navigate(props.href);
          }
        })}
      >
        {props.children}
      </a>
    );
  };
}
