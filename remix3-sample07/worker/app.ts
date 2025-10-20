import { Hono } from "hono";
import handler from "../src/server.tsx";

const app = new Hono();
app.get("*", async (c) => {
  return handler(c.req.url);
});

export default app;
