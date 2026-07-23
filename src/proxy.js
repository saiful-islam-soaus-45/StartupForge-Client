import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // return NextResponse.redirect(new URL("/auth/login", request.url));
    const currentUrl = request.nextUrl.pathname;
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", currentUrl);

    return NextResponse.redirect(loginUrl);
  }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ['/browse-startups', '/opportunities'],
};
