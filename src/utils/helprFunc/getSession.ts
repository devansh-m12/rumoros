import { getWebsite } from "@/actions/prisma/website";
import { getWebsiteSession } from "@/actions/session/websiteSession";
import { uuid, visitSalt } from "./crypto";
import { getClientInfo } from "./detect";
import { createSession } from "@/actions/session/createSession";
import { NextRequestTrack } from "@/types/request";

export const getSession = async (req: NextRequestTrack, parsedBody: any) => {
    try {
        const { payload } = parsedBody;
        const { website: websiteId, hostname, screen, language } = payload;
        const website = await getWebsite(websiteId);
        // if(!website) {
        //     return NextResponse.json({
        //         success: false,
        //         error: 'Website not found'
        //     }, { status: 404 });
        // }
        // Create a modified request object that matches the expected structure
        const modifiedReq = {
            headers: req.headers,
            body: {
                payload: {
                    screen :screen ||'',
                }
            }
        };
        const { userAgent, browser, os, ip, country, subdivision1, subdivision2, city, device } = await getClientInfo(modifiedReq);


        const sessionId = uuid(websiteId, hostname,ip,userAgent);
        const visitId = uuid(sessionId, visitSalt());

        let session = await getWebsiteSession(websiteId, sessionId);
        if (!session) {
            try {
                session = await createSession({
                    id: sessionId,
                    websiteId: websiteId,
                    hostname,
                    browser,
                    os,
                    device,
                    screen,
                    language,
                    country,
                    subdivision1,
                    subdivision2,
                    city,
                });
            } catch (error) {
                console.error('Session creation error:', error);
                return null;
            }
        }
        return {
            ...session,
            visitId
        };
    } catch (error) {
        console.error('Get session error:', error);
        throw error;
    }
}