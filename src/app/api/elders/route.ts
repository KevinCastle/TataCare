import { Elder } from '@/app/api/elders/types';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { User } from '../user/types';

export async function GET() {
  noStore();
  try {
    const session = await auth();

    if (!session?.user) {
      return new Response('User not found', { status: 404 });
    }

    const userData = await sql`SELECT * FROM users WHERE email=${session.user.email}`;
    if (userData.rowCount === 0) {
      return new Response('User not found', { status: 404 });
    }
    const user = userData.rows[0] as User;

    const data = await sql<Elder>`
      SELECT *
      FROM elders
      JOIN elder_user ON elders.id = elder_user.elder_id
      WHERE elder_user.user_id = ${user.id}
      ORDER BY name ASC
    `;

    const elders = data.rows;
    return Response.json(elders);
  } catch (err) {
    throw new Error('Failed to fetch all elders.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const requestBody = await request.json();
    const { elder, userId } = requestBody;

    if (!userId) {
      throw new Error('Missing user ID.');
    }

    const checkElderExistsQuery = `
      SELECT id FROM elders WHERE id = $1;
    `;
    const existingElderData = await sql.query<{ id: string }>(checkElderExistsQuery, [elder.id]);

    if (existingElderData.rowCount === 0) {
      const elderKeys = Object.keys(elder).join(', ');
      const elderPlaceholders = Object.keys(elder).map((_, index) => `$${index + 1}`).join(', ');
      const elderValues = Object.values(elder);

      const elderQuery = `
      INSERT INTO elders (${elderKeys})
      VALUES (${elderPlaceholders})
      RETURNING id;
    `;

      await sql.query<{ id: string }>(elderQuery, elderValues);
    }

    const elderUserQuery = `
      INSERT INTO elder_user (elder_id, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `;

    await sql.query(elderUserQuery, [elder.id, userId]);

    return new Response(JSON.stringify(existingElderData.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to create elder. ${err}`);
  }
}
