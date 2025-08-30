import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL: process.env.NEXT_PUBLIC_API_URL!,
    fetchOptions: {
      credentials: "include",
    },
  },
);

export const signIn: typeof authClient.signIn = authClient.signIn;
export const signOut: typeof authClient.signOut = authClient.signOut;
export const signUp: typeof authClient.signUp = authClient.signUp;
export const getSession: typeof authClient.getSession = authClient.getSession;
export const useSession: typeof authClient.useSession = authClient.useSession;
