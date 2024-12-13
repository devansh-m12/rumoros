import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const payload = await req.json();
    console.log(payload);
    return NextResponse.json({message: 'POST request to the homepage'});
}