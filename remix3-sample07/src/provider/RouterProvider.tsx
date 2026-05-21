import type { Handle, Props, RemixNode } from "@remix-run/component";
import { RoutePattern, type RouteMatch } from "@remix-run/route-pattern";

const isServer = typeof window === "undefined";

export function RouterProvider(
  this: Handle<{
    serverUrl: string;
    navigate: (url: string) => void;
    params?: RouteMatch<string>;
  }>
) {
  const context = {
    serverUrl: "",
    navigate: (url: string) => {
      history.pushState({}, "", url);
      this.update();
    },
  };
  this.context.set(context);

  const handlePopState = () => {
    this.update();
  };
  if (!isServer) {
    addEventListener("popstate", handlePopState);
  }
  return ({ url, children }: { url?: string; children: RemixNode }) => {
    if (isServer && url) {
      context.serverUrl = url;
    }
    return <>{children}</>;
  };
}

export const useLocation = (inst: Handle) => {
  if (isServer) {
    const url = new URL(inst.context.get(RouterProvider).serverUrl);
    return url.pathname;
  }
  return location.pathname;
};

export const useFullLocation = (inst: Handle) => {
  if (isServer) {
    const url = new URL(inst.context.get(RouterProvider).serverUrl);
    return url.href;
  }
  return location.href;
};

export const useNavigate = (inst: Handle) => {
  return inst.context.get(RouterProvider).navigate;
};

export const useParams = <T extends Record<string, unknown>>(inst: Handle) => {
  const p = inst.context.get(RouterProvider).params;
  if (!p) throw "error params";
  return p.params as T;
};

export function Link(this: Handle) {
  const navigate = useNavigate(this);
  return (props: Props<"a">) => {
    return (
      <a
        {...props}
        on={{
          click: (e) => {
            e.preventDefault();
            if (props.href) {
              navigate(props.href);
            }
          },
        }}
      >
        {props.children}
      </a>
    );
  };
}

export type RouteType = Record<string, unknown>;

export const useRouter = (inst: Handle, route: RouteType) => {
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
