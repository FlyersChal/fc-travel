import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.password);
        if (!valid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          image: admin.avatarUrl,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7200 },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
};

/**
 * Check if the current request is from an authenticated admin.
 * In dev (no DATABASE_URL), returns "dev-user" for convenience.
 */
export async function requireAdmin(): Promise<string> {
  if (process.env.ENABLE_AUTH !== "true") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Authentication is disabled in production");
    }
    return "dev-user";
  }

  // Dynamic import to avoid issues in edge/client contexts
  const { getServerSession } = await import("next-auth");
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized: not logged in");
  }

  const admin = await prisma.admin.findUnique({
    where: { email: session.user.email },
  });
  if (!admin) {
    throw new Error("Unauthorized: not an admin");
  }

  return admin.id;
}

/**
 * Authenticate via API Key (Authorization: Bearer <token>) or fall back to
 * session-based admin auth.  Works for both external API calls and web UI.
 */
export async function requireApiKeyOrAdmin(): Promise<string> {
  // Try API Key from Authorization header first
  const { headers } = await import("next/headers");
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice(7);
    const { validateApiKey } = await import("@/lib/db/api-keys");
    const adminId = await validateApiKey(token);
    if (adminId) return adminId;
    throw new Error("Unauthorized: invalid or expired API key");
  }

  // Fall back to session-based auth
  return requireAdmin();
}
