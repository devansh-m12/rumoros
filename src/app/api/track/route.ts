import { getClientInfo } from '@/utils/helprFunc/detect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        
        // Create a modified request object that matches the expected structure
        const modifiedReq = {
            headers: req.headers,
            body: {
                payload: {
                    ...payload,
                    screen: payload?.payload?.screen || ''
                }
            }
        };
        

        const clientInfo = await getClientInfo(modifiedReq);
        console.log(clientInfo);
        return NextResponse.json({
            success: true,
            data: clientInfo
        });
    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process tracking request' },
            { status: 500 }
        );
    }
}