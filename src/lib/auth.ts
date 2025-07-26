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
                if (request.nextUrl.pathname.includes("/login") || request.nextUrl.pathname.includes("/signup")) {
                    return Response.redirect(new URL("/payment", request.nextUrl));
                }

                return true;
            }

            if (isLoggedIn && isTryingToAccessApp) {
                return true;
            }

            return false;
        },
        jwt: ({ token, user }) => {
            if (user) {
                // on sign in
                token.userId = user.id;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (session.user && token.userId) {
                session.user.id = token.userId;
            }

            return session;
        }
    }
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);