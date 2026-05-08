// Run on edge
import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google"
import GitHub from '@auth/core/providers/github'

const { auth } = NextAuth({
    providers: [Google, GitHub, Credentials({
        async authorize(credentials) {
            return null
        },
    })],
    session: { strategy: 'jwt' },
    trustHost: true,
});

export default auth((req) => {
    console.log('PROXY ', req.nextUrl.pathname, req.auth);

    if (!req.auth) {  // NO AUTENTICADO

        let callbackUrl = req.nextUrl.pathname;
        if (req.nextUrl.search) {
            callbackUrl += req.nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(req.nextUrl.origin
            + `/login?callbackUrl=${encodedCallbackUrl}`)
    }

})



export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - register, login, logout, error, verify-request
         * - pizzas
         * - images (into /public)
         * - pwa (into /public) 
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - $ (root page)
         */
        '/((?!api|register|login|logout|error|verify-request|images|pwa|pizzas|carrito|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$).*)',
    ]
}