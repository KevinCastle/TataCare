import { Shared } from '@/app/api/elders/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const sharedId = searchParams.get('sharedId');
    if (sharedId) {
      const data = await sql`SELECT * FROM shared WHERE id=${sharedId}`;
      const shared = data.rows[0] as Shared;
      return Response.json(shared);
    }
    return new Error('Failed to fetch shared link.');
  } catch (err) {
    throw new Error('Failed to fetch shared link.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const shared = await request.json();

    const keys = (Object.keys(shared)).join(', ');
    const placeholders = Object.keys(shared).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(shared);

    const query = `
      INSERT INTO shared (${keys})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const data = await sql.query<Shared>(query, values);

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to create shared link.');
  }
}

export async function POST(request: Request) {
  noStore();

  try {
    const requestBody = await request.json();

    const { id, ...sharedData } = requestBody;
    const updates = Object.keys(sharedData).map((key, index) => `${key} = $${index + 2}`).join(', ');

    const values = Object.values(sharedData);
    values.unshift(id);

    const query = `
      UPDATE shared
      SET ${updates}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await sql.query(query, values);

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to edit shared link. ${err}`);
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM shared 
    WHERE id=${id}
    `;
    return Response.json({ message: `shared link ${id} deleted successfully` });
  } catch (err) {
    throw new Error('Failed to delete shared link.');
  }
}
