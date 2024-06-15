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
    console.error('Database Error:', err);
    throw new Error('Failed to fetch diseases.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const requestBody = await request.json();
    const { disease } = requestBody;

    const keys = Object.keys(disease).join(', ');
    const values = Object.values(disease).join(', ');

    const result = await sql<Disease>`
      INSERT INTO diseases (${keys})
        VALUES (${values})
    `;

    return result.rows[0] as Disease;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create disease.');
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM diseases 
    WHERE id=${id}
    `;
    return Response.json({ message: `Disease ${id} deleted successfully` });
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to delete disease.');
  }
}
