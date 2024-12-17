import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, getUserByUsername } from "@/actions/prisma/users";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password, email } = body;

        // Input validation
        if (!username || !password || !email) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user exists
        if(await getUserByUsername(username)) {
            return NextResponse.json(
                { message: 'Username already exists' },
                { status: 400 }
            );
        }
        if(await getUserByEmail(email)) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            );
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            username,
            password: hashedPassword,
            email
        });

        // Return success response without sensitive data
        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Failed to create user', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}