import { betterFetch } from "@better-fetch/fetch";
import { headers } from "next/headers";
// import { type NextRequest } from "next/server";

/**
 * Retrieves the user's authentication session data from the API
 *
 * This function fetches the current user session by making a server-side request
 * to validate the session. It forwards cookies but relies on server-side validation.
 *
 * @async
 * @returns {Promise<Session | null>} The user session object if authenticated, null otherwise
 */
export async function getSession() {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    if (!cookieHeader) {
      console.log("No cookies found");
      return null;
    }

    // Make a server-side request to validate the session
    const response = await betterFetch<any>("/session", {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        cookie: cookieHeader,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
