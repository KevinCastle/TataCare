import { User } from '@/app/api/user/types';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

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

export async function PUT(request: Request) {
  try {
    const user = await request.json();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const keys = (Object.keys(user)).join(', ');
    const placeholders = Object.keys(user).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(user);

    const query = `
      INSERT INTO users (${keys})
      VALUES (${placeholders})
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `;

    const data = await sql.query<User>(query, values);

    if (data.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'El correo ingresado ya está registrado.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to create user. ${err}`);
  }
}
