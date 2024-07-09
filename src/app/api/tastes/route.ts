import { Taste } from '@/app/api/tastes/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const elderId = searchParams.get('elderId');
    const data = await sql` SELECT * FROM taste WHERE elder_id=${elderId}`;
    const tastes = data.rows;
    return Response.json(tastes);
  } catch (err) {
    throw new Error('Failed to fetch tastes.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const taste = await request.json();

    const keys = (Object.keys(taste)).join(', ');
    const placeholders = Object.keys(taste).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(taste);

    const query = `
      INSERT INTO taste (${keys})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const data = await sql.query<Taste>(query, values);

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to create taste.');
  }
}

export async function POST(request: NextRequest) {
  noStore();

  try {
    const requestBody = await request.json();

    const { id, ...tasteData } = requestBody;
    const updates = Object.keys(tasteData).map((key, index) => `${key} = $${index + 2}`).join(', ');

    const values = Object.values(tasteData);
    values.unshift(id);

    const query = `
      UPDATE taste
      SET ${updates}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await sql.query(query, values);

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to edit taste. ${err}`);
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM tastes 
    WHERE id=${id}
    `;
    return Response.json({ message: `Taste ${id} deleted successfully` });
  } catch (err) {
    throw new Error('Failed to delete taste.');
  }
}
