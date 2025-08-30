import { Context } from "hono";
import type { User, Session } from "../db/schema";

export type HonoEnv = {
  Bindings: CloudflareBindings;
  Variables: {
    user: User | null;
    session: Session | null;
  };
};

export type ContextType = Context<HonoEnv>;
