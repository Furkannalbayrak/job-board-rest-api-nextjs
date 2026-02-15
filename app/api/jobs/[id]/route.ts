import { prisma } from "@/lib/prisma";
import { stat } from "fs";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const { id } = await params
    
    const job = await prisma.job.findUnique({
        where: { id }
    })

    if (!job) {
        return NextResponse.json(
            { error: "Job not found" },
            { status: 404 }
        )
    }

    return NextResponse.json(job)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
         const { id } = await params
        const body = await req.json();
        const { title, company, location, description, salary } = body;

        const existingJob = await prisma.job.findUnique({
            where: { id }
        })

        if (!existingJob) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            )
        }

        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                title,
                company,
                location,
                description,
                salary,
            },
        })

        return NextResponse.json(updatedJob)

    } catch (error) {
        return NextResponse.json(
            { error: "Someting went wrong" },
            { status: 500 }
        )
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
         const { id } = await params
        const existingJob = await prisma.job.findUnique({
            where: { id }
        })

        if (!existingJob) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 },
            )
        }

        await prisma.job.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Job deleted" });

    } catch (error) {
        return NextResponse.json(
            { error: "Someting went wrong" },
            { status: 500 }
        )
    }
}