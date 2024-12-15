import { createMiddleware } from '@/utils/middleware';
import { log } from '@/utils/logger';
import { badRequest, notFound } from '@/utils/response';
import { getSession } from '../helprFunc/getSession';
import { NextResponse } from 'next/server';
import { NextRequestTrack } from '@/types/request';

export const useSession = async (
    req: NextRequestTrack, 
    res: NextResponse, 
    next: () => void,
    parsedBody: any
) => {
    try {
      const session = await getSession(req, parsedBody);
      if (!session) {
        log('useSession: Session not found');
        return badRequest(res, 'Session not found.');
      }
  
      (req as any).session = session;
      next();
    } catch (e: any) {
      if (e.message.startsWith('Website not found')) {
        return notFound(res, e.message);
      }
      return badRequest(res, e.message);
    }
} 