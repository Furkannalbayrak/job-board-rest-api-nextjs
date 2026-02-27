import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import * as z from 'zod'

export async function GET(_req: NextRequest) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}


// Define a schema for input validation
const UserSchema = z
    .object({
        username: z.string().min(1, 'Username is required').max(100),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must have than 8 characters'),
    })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = UserSchema.parse(body);

        // check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: email }
        });
        if (existingEmail) {
            return NextResponse.json({ user: null, message: "User with this email alread exists" }, { status: 400 })
        }

        // check if name already exists
        const existingName = await prisma.user.findUnique({
            where: { username: username }
        });
        if (existingName) {
            return NextResponse.json({ user: null, message: "User with this username alread exists" }, { status: 400 })
        }

        // kullanıcıyı kaydetmende önce şifresini hashledik
        const hashedPassword = await hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            }
        })

        const { password: newUserPassword, ...rest } = newUser

        return NextResponse.json({ user: rest, message: "user created successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Someting went wrong!" }, { status: 500 });
    }
}



























