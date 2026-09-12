import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

// Corre antes de que se rendericen los Server Components (antes
// "middleware.ts", renombrado a "proxy.ts" en Next.js 16). Necesario porque
// un redirect() dentro de un layout protegido no impide que páginas hijas
// ya hayan ejecutado sus queries (y filtrado datos en el payload RSC) antes
// de que el redirect tome efecto — ver commit que agrega este archivo.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
