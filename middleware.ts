import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/chat/:path*",
    "/resume-review/:path*",
    "/mock-interview/:path*",
    "/roadmap/:path*",
    "/job-match/:path*",
    "/cover-letter/:path*",
    "/settings/:path*",
  ],
};