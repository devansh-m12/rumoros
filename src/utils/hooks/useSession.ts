import { createMiddleware } from '@/utils/middleware';
import { log } from '@/utils/logger';
import { badRequest, notFound } from '@/utils/response';
import { getSession } from '../helprFunc/getSession';
import { NextRequest, NextResponse } from 'next/server';

export const useSession = createMiddleware(async (req: NextRequest, res: NextResponse, next: () => void) => {
    try {
      const session = await getSession(req);
      console.log(session);
  
      if (!session) {
        log('useSession: Session not found');
        return badRequest(res, 'Session not found.');
      }
  
      (req as any).session = session;
    } catch (e: any) {
      if (e.message.startsWith('Website not found')) {
        return notFound(res, e.message);
      }
      return badRequest(res, e.message);
    }
  
    next();
  });