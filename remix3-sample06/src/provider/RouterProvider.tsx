import { type Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { RoutePattern, type RouteMatch } from "@remix-run/route-pattern";

const isServer = typeof window === "undefined";

export function RouterProvider(
  this: Remix.Handle<{
    serverUrl: string;
    navigate: (url: string) => void;
    params?: RouteMatch<string>;
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

export const useFullLocation = (inst: Remix.Handle) => {
  if (isServer) {
    const url = new URL(inst.context.get(RouterProvider).serverUrl);
    return url.href;
  }
  return location.href;
};

export const useNavigate = (inst: Remix.Handle) => {
  return inst.context.get(RouterProvider).navigate;
};

export const useParams = <T extends Record<string, unknown>>(
  inst: Remix.Handle
) => {
  const p = inst.context.get(RouterProvider).params;
  if (!p) throw "error params";
  return p.params as T;
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

export type RouteType = Record<string, Remix.Component>;

export const useRouter = (inst: Remix.Handle, route: RouteType) => {
  const location = useFullLocation(inst);

  for (const [pattern, content] of Object.entries(route)) {
    const p = new RoutePattern(pattern);
    const match = p.match(location);
    if (match) {
      inst.context.get(RouterProvider).params = match;
      return content;
    }
  }
  return <></>;
};
