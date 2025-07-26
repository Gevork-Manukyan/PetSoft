import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./zod-schemas";

const config = {
    pages: {
        signIn: "/login"
    },
    session: {
        maxAge: 24 * 60 * 60,
        strategy: "jwt"
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                // runs on login

                const validatedFormData = authSchema.safeParse(credentials);
                if (!validatedFormData.success) return null;

                const { email, password } = validatedFormData.data;
                const user = await getUserByEmail(email);

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

                if (!passwordsMatch) return null;

                return user;
            }
        })
    ],
    callbacks: {
        // Runs on every request with middleware
        authorized: ({ auth, request }) => {
            const isLoggedIn = Boolean(auth?.user);
            const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

            if (!isLoggedIn && isTryingToAccessApp) {
                return false;
            }

            if (!isLoggedIn && !isTryingToAccessApp) {
                return true;
            }

            if (isLoggedIn && !isTryingToAccessApp) {
                if ((request.nextUrl.pathname.includes("/login") || request.nextUrl.pathname.includes("/signup")) && !auth?.user.hasAccess) {
                    return Response.redirect(new URL("/payment", request.nextUrl));
                }

                return true;
            }
            
            if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
                return Response.redirect(new URL("/payment", request.nextUrl));
            }

            if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
                return true;
            }

            return false;
        },
        jwt: async ({ token, user, trigger }) => {
            if (user) {
                // on sign in
                token.userId = user.id;
                token.email = user.email!;
                token.hasAccess = user.hasAccess;
            }

            if (trigger === "update") {
                const userFromDb = await getUserByEmail(token.email);
                if (userFromDb) {
                    token.hasAccess = userFromDb.hasAccess;
                }
            }

            return token;
        },
        session: ({ session, token }) => {
            session.user.id = token.userId;
            session.user.hasAccess = token.hasAccess;

            return session;
        }
    }
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);