import { NextResponse } from 'next/server';

export const ok = (res: NextResponse, data: any = {}) => {
  return NextResponse.json({data}, { status: 200 });
};

export const created = (res: NextResponse, data: any = {}) => {
  return NextResponse.json({data}, { status: 201 });
};

export const badRequest = (res: NextResponse, message: string = 'Bad Request') => {
  return NextResponse.json({ error: message }, { status: 400 });
};

export const unauthorized = (res: NextResponse, message: string = 'Unauthorized') => {
  return NextResponse.json({ error: message }, { status: 401 });
};

export const forbidden = (res: NextResponse, message: string = 'Forbidden') => {
  return NextResponse.json({ error: message }, { status: 403 });
};

export const notFound = (res: NextResponse, message: string = 'Not Found') => {
  return NextResponse.json({ error: message }, { status: 404 });
};

export const serverError = (res: NextResponse, message: string = 'Internal Server Error') => {
  return NextResponse.json({ error: message }, { status: 500 });
}; 