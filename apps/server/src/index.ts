import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRouter } from "./auth";
import { mlRouter } from "./routes/ml";
import { auth } from "./auth";
import { HonoEnv } from "./definitions/common.types";
import { ApiResponse } from "./helpers/api-response";

const app = new Hono<HonoEnv>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://dine.hirayalab.co.in"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 86400, // 24 hours
    credentials: true,
  }),
);

// for authentication
app.use("*", async (c, next) => {
  const session = await auth(c.env).api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const allowedRoles = ["user", "guest", "admin"] as const;
  const role = allowedRoles.includes(session.user.role as any)
    ? (session.user.role as "user" | "guest" | "admin")
    : null;
  c.set("user", {
    ...session.user,
    image: session.user.image ?? null,
    phone: session.user.phone ?? null,
    role,
  });
  c.set("session", {
    ...session.session,
    ipAddress: session.session.ipAddress ?? null,
    userAgent: session.session.userAgent ?? null,
  });
  return next();
});

app.route("/", authRouter);
app.route("/ml", mlRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use(async (c) => {
  // Handle 404 Not Found
  return c.json(
    ApiResponse.notFound(
      "The specified endpoint does not exist. Please verify the API path.",
    ),
    404,
  );
});

export default app;
