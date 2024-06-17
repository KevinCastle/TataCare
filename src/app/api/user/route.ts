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

      if (!session?.user) return null;

      console.log(session.user);
      return Response.json(session?.user);
    }
    const data = await sql`SELECT * FROM users WHERE email=${email}`;
    const user = data.rows[0] as User;
    return Response.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
