
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
      issuer: "https://discord.com",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;

        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: "discord",
          },
        });

        if (account) {
          (session.user as any).discordId = account.providerAccountId;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/giris",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true,
});
