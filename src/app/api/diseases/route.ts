import { Disease } from '@/app/api/diseases/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const elderId = searchParams.get('elderId');
    const data = await sql` SELECT * FROM disease WHERE elder_id=${elderId}`;
    const diseases = data.rows;
    return Response.json(diseases);
  } catch (err) {
    throw new Error('Failed to fetch diseases.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const disease = await request.json();

    const keys = (Object.keys(disease)).join(', ');
    const placeholders = Object.keys(disease).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(disease);

    const query = `
      INSERT INTO disease (${keys})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const data = await sql.query<Disease>(query, values);

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to create disease.');
  }
}

export async function POST(request: NextRequest) {
  noStore();

  try {
    const requestBody = await request.json();

    const { id, ...diseaseData } = requestBody;
    const updates = Object.keys(diseaseData).map((key, index) => `${key} = $${index + 2}`).join(', ');

    const values = Object.values(diseaseData);
    values.unshift(id);

    const query = `
      UPDATE disease
      SET ${updates}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await sql.query(query, values);

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to edit disease. ${err}`);
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM disease 
    WHERE id=${id}
    `;
    return Response.json({ message: `Disease ${id} deleted successfully` });
  } catch (err) {
    throw new Error('Failed to delete disease.');
  }
}
