import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const filename = searchParams.get('filename');

  if (!filename) {
    return new NextResponse('Filename is required', { status: 400 });
  }

  if (!request.body) {
    return new NextResponse('Request body is required', { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
