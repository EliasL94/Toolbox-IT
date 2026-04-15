import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "toolbox-it-super-secret-dev-key-123456789",
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyze/:path*",
    "/architect/:path*",
    "/reviews/:path*"
  ]
};
