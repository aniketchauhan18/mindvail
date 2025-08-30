// single pattern here / connection pooling
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { ContextType } from "../definitions/common.types";

const dbCache = new WeakMap<D1Database, ReturnType<typeof drizzle>>();

export const connectDB = (c: ContextType) => {
  const d1Database = c.env.DB as D1Database;
  if (dbCache.has(d1Database)) {
    return dbCache.get(d1Database)!;
  }

  const db = drizzle(d1Database, { schema });
  dbCache.set(d1Database, db);
  return db;
};
