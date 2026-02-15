import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const jobs = await prisma.job.findMany();
    return NextResponse.json(jobs);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, company, location, description, salary } = body;

        if (!title || !company || !location || !description) {
            return NextResponse.json(
                { error: "Missing request fields" },
                { status: 400 }
            )
        }

        const job = await prisma.job.create({
            data: {
                title,
                company,
                location,
                description,
                salary,
            },
        })
        return NextResponse.json(job, { status: 201 })

    } catch (error) {
        return NextResponse.json(
            { eroor: "Someting went worng" },
            { status: 500 }
        )
    }
}








