import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabase";
import type { AgentRole } from "@/types";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET no está configurado. Añádelo al archivo .env.local");
}

// Extend NextAuth session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nick: string;
      role: AgentRole;
      name: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    nick: string;
    role: AgentRole;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nick: string;
    role: AgentRole;
    name: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        nick: { label: "Nick", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.nick || !credentials?.password) return null;

        const { data: agent, error } = await supabaseAdmin
          .from("agents")
          .select("id, nick, name, role, password_hash, is_active")
          .eq("nick", credentials.nick.toLowerCase().trim())
          .single();

        if (error || !agent) return null;
        if (!agent.is_active) throw new Error("INACTIVE");

        const valid = await bcrypt.compare(credentials.password, agent.password_hash);
        if (!valid) return null;

        return {
          id: agent.id,
          nick: agent.nick,
          name: agent.name,
          role: agent.role as AgentRole,
          email: `${agent.nick}@agental.ia`
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nick = user.nick;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.nick = token.nick;
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60 // 7 días
  },
  secret: process.env.NEXTAUTH_SECRET
};
