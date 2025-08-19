import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware()
  // Rutas públicas que no requieren autenticación
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};