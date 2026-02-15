import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
     const { id } = await params
    const user = await prisma.user.findUnique({
        where: { id }
    })

    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        )
    }

    return NextResponse.json(user);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
         const { id } = await params
        const body = await req.json();
        const { email, name } = body;

        const existingUser = await prisma.user.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                name,
            },
        })

        return NextResponse.json(updatedUser)

    } catch (error) {
        return NextResponse.json(
            { error: "Someting went wrong" },
            { status: 500 }
        )
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
         const { id } = await params
        const existingUser = await prisma.user.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            )
        }

        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ message: "User deleted" })
    } catch (error) {
        return NextResponse.json(
            { error: "Someting went wrong" },
            { status: 500 }
        )
    }
}