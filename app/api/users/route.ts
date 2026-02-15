import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, name } = body;

        if (!email || !name) {
            return NextResponse.json(
                { error: "Missing request fields" },
                { status: 400 }
            )
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
            },
        })

        return NextResponse.json(user, { status: 201 })

    } catch (error) {
        return NextResponse.json(
            { eroor: "Someting went worng" },
            { status: 500 }
        )
    }
}