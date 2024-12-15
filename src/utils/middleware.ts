import { NextRequest, NextResponse } from 'next/server';
import { badRequest } from './response';

type MiddlewareFunction = (
  req: any,
  res: NextResponse,
  next: () => void
) => Promise<void | NextResponse>;

export const createMiddleware = (middleware: MiddlewareFunction) => {
  return async (req: any, res: NextResponse, next: () => void) => {
    try {
      await middleware(req, res, next);
    } catch (error) {
      console.error('Middleware error:', error);
      return badRequest(res, 'Internal Server Error');
    }
  };
}; 