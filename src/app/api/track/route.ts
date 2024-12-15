import { getWebsite } from '@/actions/prisma/website';
import { createSession } from '@/actions/session/createSession';
import { saveSessionData } from '@/actions/session/saveSessionData';
import { COLLECTION_TYPE } from '@/lib/constants';
import { NextRequestTrack, TrackRequest } from '@/types/request';
import { createToken, secret, uuid, visitSalt } from '@/utils/helprFunc/crypto';
import { getClientInfo } from '@/utils/helprFunc/detect';
import { useSession } from '@/utils/hooks/useSession';
import { badRequest, ok } from '@/utils/response';
import { NextRequest, NextResponse } from 'next/server';
import { saveEvent } from '@/actions/events/saveEvent';

export async function POST(req: NextRequestTrack) {
    try {
        const body = await req.json();
        await useSession(req, NextResponse.next(), () => {}, body);
        const session = req?.session;
        const { type, payload } = body;
        const { url, referrer, name: eventName, data, title, tag } = payload;
        const pageTitle = decodeURI(title);
       
        // if session not found, return bad request
        if(!session) {
            return badRequest(NextResponse.next(), 'Session not found');
        }

        const curriat = Math.floor(new Date().getTime() / 1000);

        // expire session after 30 minutes
        const expire = curriat + 30 * 60;

        // if session expired, return bad request
        if( session?.iat && session?.iat < curriat) {
            session.visitId = uuid(session.id, visitSalt());
        }
        session.iat = curriat;

        if(type === COLLECTION_TYPE.event) {
            // eslint-disable-next-line prefer-const
            let [urlPath, urlQuery] = decodeURI(url)?.split('?') || [];
            let [referrerPath, referrerQuery] = decodeURI(referrer)?.split('?') || [];
            let referrerDomain = '';

            if (!urlPath) {
                urlPath = '/';
            }

            if (/^[\w-]+:\/\/\w+/.test(referrerPath)) {
                const refUrl = new URL(referrer);
                referrerPath = refUrl.pathname;
                referrerQuery = refUrl.search.substring(1);
                referrerDomain = refUrl.hostname.replace(/www\./, '');
            }

            if (process.env.REMOVE_TRAILING_SLASH) {
                urlPath = urlPath.replace(/(.+)\/$/, '$1');
            }

           try {
            // console.log("session",session);
            await saveEvent({
                ...session,
                sessionId: session.id as string,
                websiteId: session.websiteId as string,
                visitId: session.visitId as string,
                urlPath,
                urlQuery,
                referrerPath,
                referrerQuery,
                referrerDomain,
                pageTitle,
                eventName,
                eventData: data,
                tag,
            });
           } catch (error) {
            console.error('Tracking error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to save event' },
                { status: 500 }
            );
           }
            
        } else if (type === COLLECTION_TYPE.identify) {
            if (!data) {
              return badRequest(NextResponse.next(), 'Data required.');
            }
      
            await saveSessionData({
              websiteId: session.websiteId,
              sessionId: session.id,
              sessionData: data,
            });
          }

          const token = createToken(session, secret());

          return NextResponse.json({ success: true, token, session });

    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process tracking request' },
            { status: 500 }
        );
    }
}
