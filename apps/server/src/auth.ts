import { betterAuth } from "better-auth";
import type { User, Session } from "../src/db/schema";
import { drizzle } from "drizzle-orm/d1";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as schema from "../src/db/schema";
import { Hono } from "hono";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: {
    user: User;
    session: Session;
  };
}>();

export const db = (env: CloudflareBindings) => drizzle(env.DB);

export const auth = (env: CloudflareBindings) => {
  const isProduction = env.NODE_ENV === "production";

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(drizzle(env.DB), {
      provider: "sqlite",
      schema: {
        accounts: schema.accounts,
        sessions: schema.sessions,
        users: schema.users,
        verifications: schema.verifications,
      },
      usePlural: true,
    }),
    secret: env.SECRET,
    session: {
      cookieCache: {
        enabled: true,
        maxAge: isProduction ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days in prod, 7 days in dev
      },
      expiresIn: isProduction ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days in prod, 7 days in dev
      updateAge: isProduction ? 60 * 60 * 24 * 3 : 60 * 60 * 24, // 3 days in prod, 1 day in dev
    },
    socialProviders: {
      google: {
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
        redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          required: false,
        },
        phone: {
          type: "string",
          defaultValue: null,
          required: false,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    advanced: isProduction
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: "hirayalab.co.in",
          },
        }
      : {
          ipAddress: {
            disableIpTracking: true,
          },
        },
    trustedOrigins: isProduction
      ? ["https://mindvail.hirayalab.co.in"]
      : [
          "http://localhost:3000",
          "http://localhost:8787",
          "http://127.0.0.1:3000",
        ],
  });
};

app.get("/session", async (c) => {
  const session = {
    session: c.get("session"),
    user: c.get("user"),
  };
  if (!session) return c.body(null, 401);
  return c.json(
    {
      data: session,
    },
    200,
  );
});

export const authRouter = app.all("/api/auth/*", (c) => {
  try {
    const authHandler = auth(c.env).handler;
    return authHandler(c.req.raw);
  } catch (error) {
    console.error("Auth router error:", error);
    return new Response("Auth error", { status: 500 });
  }
});
