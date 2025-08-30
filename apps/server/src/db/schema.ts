import { users } from "./schemas/users";
import { sessions } from "./schemas/sessions";
import { accounts } from "./schemas/accounts";
import { verifications } from "./schemas/verifications";

export { users, sessions, accounts, verifications };

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
