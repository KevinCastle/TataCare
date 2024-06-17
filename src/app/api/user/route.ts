import { User } from '@/app/api/user/types';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const email = searchParams.get('email');
    if (!email) {
      const session = await auth();

      if (!session?.user) {
        return new Response('User not found', { status: 404 });
      }

      return new Response(JSON.stringify(session.user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = await sql`SELECT * FROM users WHERE email=${email}`;
    if (data.rowCount === 0) {
      return new Response('User not found', { status: 404 });
    }
    const user = data.rows[0] as User;
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Failed to fetch user.', { status: 500 });
  }
}
