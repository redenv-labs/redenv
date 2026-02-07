import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CURRENT_URL_HEADER, ORIGIN_HEADER } from "./config";

export async function proxy(request: NextRequest) {
  // write current url in header to use it in whole application
  const headers = new Headers(request.headers);
  headers.set(ORIGIN_HEADER, request.nextUrl.origin);
  headers.set(CURRENT_URL_HEADER, request.nextUrl.href);

  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|mp4|webm|mp3|pdf|gif|zip|webmanifest|xml|txt)).*)",
  ],
};
