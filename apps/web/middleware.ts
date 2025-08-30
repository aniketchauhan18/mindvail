import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./lib/session";

export default async function authMiddleware(request: NextRequest) {
  // extracting out full path of the url except base url
  const { pathname, search, hash } = request.nextUrl;
  const fullPath = `${pathname}${search}${hash}`;
  const session = await getSession();
  console.log(session);
  // console.log("Session Cookie:", session);

  if (!session?.user) {
    // adding user current route in searchParam
    const redirectURL = new URL("/auth", request.url);
    redirectURL.searchParams.set("redirectURL", fullPath);
    return NextResponse.redirect(redirectURL);
  }
  if (fullPath === "/auth" && session?.user) {
    // If the user is authenticated and trying to access auth page, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|auth|icons/|images/|$|.*\\.).*)",
  ],
};
