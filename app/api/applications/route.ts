import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const userId = searchParams.get("userId") || undefined;
        const jobId = searchParams.get("jobId") || undefined;

        const applications = await prisma.application.findMany({
            where: {
                ...(userId && { userId }),
                ...(jobId && { jobId }),
            },
            include: {
                user: true,
                job: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Applications GET error:', error);
        return NextResponse.json(
            { error: "Applications getirilemedi" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, jobId } = body;

        if (!userId || !jobId) {
            return NextResponse.json(
                { error: "userId ve jobId zorunlu" },
                { status: 400 }
            );
        }

        // Önce user var mı kontrol et
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            // User yoksa oluştur
            await prisma.user.create({
                data: {
                    id: userId,
                    email: `${userId}@example.com`,
                    name: `User ${userId}`,
                },
            });
        }

        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            return NextResponse.json(
                { error: "İş ilanı bulunamadı" },
                { status: 404 }
            );
        }

        // Aynı kullanıcı aynı işe 2 kere başvuramasın
        const existing = await prisma.application.findUnique({
            where: {
                jobId_userId: {
                    jobId,
                    userId,
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Bu işe zaten başvurdunuz" },
                { status: 409 }
            );
        }

        const application = await prisma.application.create({
            data: {
                userId,
                jobId,
            },
            include: {
                user: true,
                job: true,
            },
        });

        return NextResponse.json(application, { status: 201 });

    } catch (error) {
        console.error('Applications POST error:', error);
        return NextResponse.json(
            { error: "Başvuru oluşturulamadı" },
            { status: 500 }
        );
    }
}