import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // FIXME: organizar variavel de ambiente interno do docker
  const res = await fetch(`http://backend:3000/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const setCookie = res.headers.get('set-cookie');

  const response = NextResponse.json(data, { status: res.status });

  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
}