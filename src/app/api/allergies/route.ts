import { Allergy } from '@/app/api/allergies/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const elderId = searchParams.get('elderId');
    const data = await sql` SELECT * FROM allergy WHERE elder_id=${elderId}`;
    const allergies = data.rows;
    return Response.json(allergies);
  } catch (err) {
    throw new Error('Failed to fetch allergies.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const allergy = await request.json();

    const keys = (Object.keys(allergy)).join(', ');
    const placeholders = Object.keys(allergy).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(allergy);

    const query = `
      INSERT INTO allergy (${keys})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const data = await sql.query<Allergy>(query, values);

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to create allergy.');
  }
}

export async function POST(request: NextRequest) {
  noStore();

  try {
    const requestBody = await request.json();

    const { id, ...allergyData } = requestBody;
    const updates = Object.keys(allergyData).map((key, index) => `${key} = $${index + 2}`).join(', ');

    const values = Object.values(allergyData);
    values.unshift(id);

    const query = `
      UPDATE allergy
      SET ${updates}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await sql.query(query, values);

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to edit medication. ${err}`);
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM allergies 
    WHERE id=${id}
    `;
    return Response.json({ message: `Allergy ${id} deleted successfully` });
  } catch (err) {
    throw new Error('Failed to delete allergy.');
  }
}
