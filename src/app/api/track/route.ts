import { getWebsite } from '@/actions/prisma/website';
import { createSession } from '@/actions/session/createSession';
import { uuid, visitSalt } from '@/utils/helprFunc/crypto';
import { getClientInfo } from '@/utils/helprFunc/detect';
import { useSession } from '@/utils/hooks/useSession';
import { ok } from '@/utils/response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: any) {
    try {
        await useSession(req, NextResponse.next(), () => {});
        const session = req?.session;
        console.log("session", session);
        return ok(NextResponse.next(), {session});

    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process tracking request' },
            { status: 500 }
        );
    }
}