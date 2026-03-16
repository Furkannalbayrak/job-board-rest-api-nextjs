import NextAuth, { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            username: string | null
            role: Role
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        username: string | null
        role: Role
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        username: string | null
        role: Role
    }
}