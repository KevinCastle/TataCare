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
    const requestBody = await request.json();
    const { allergy } = requestBody;

    const keys = Object.keys(allergy).join(', ');
    const values = Object.values(allergy).join(', ');

    const result = await sql<Allergy>`
      INSERT INTO allergies (${keys})
        VALUES (${values})
    `;

    return result.rows[0] as Allergy;
  } catch (err) {
    throw new Error('Failed to create allergy.');
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
