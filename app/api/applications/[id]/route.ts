import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
     const { id } = await params
    const application = await prisma.application.findUnique({
        where: { id }
    })

    if (!application) {
        return NextResponse.json(
            { error: "Başvuru bulunamadı" },
            { status: 404 },
        )
    }

    return NextResponse.json(application);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
         const { id } = await params
        const exisitingApplication = await prisma.application.findUnique({
            where: { id }
        })

        if (!exisitingApplication) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 },
            )
        }

        await prisma.application.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Application deleted" });

    } catch (error) {
        return NextResponse.json(
            { error: "Someting went wrong" },
            { status: 500 }
        )
    }
}
