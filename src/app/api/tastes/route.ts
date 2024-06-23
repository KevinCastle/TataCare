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
    const requestBody = await request.json();
    const { taste } = requestBody;

    const keys = Object.keys(taste).join(', ');
    const values = Object.values(taste).join(', ');

    const result = await sql<Taste>`
      INSERT INTO tastes (${keys})
        VALUES (${values})
    `;

    return new Response(JSON.stringify(result.rows[0]), {
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
    const { taste } = requestBody;

    const { id, ...tasteData } = taste;
    const keys = Object.keys(tasteData);
    const values = Object.values(tasteData);
    const updates = keys.map((key, index) => `${key} = ${values[index]}`).join(', ');
    const result = await sql<Taste>`
      UPDATE taste
      SET ${updates}
      WHERE id=${id}
    `;

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to edit taste.');
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
