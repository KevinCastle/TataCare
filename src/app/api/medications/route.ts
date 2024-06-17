import { Medication } from '@/app/api/medications/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const elderId = searchParams.get('elderId');
    const data = await sql` SELECT * FROM medication WHERE elder_id=${elderId}`;
    const medications = data.rows;
    return Response.json(medications);
  } catch (err) {
    throw new Error('Failed to fetch medications.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const requestBody = await request.json();
    const { medication } = requestBody;

    const keys = Object.keys(medication).join(', ');
    const values = Object.values(medication).join(', ');

    const result = await sql<Medication>`
      INSERT INTO medications (${keys})
        VALUES (${values})
    `;

    return result.rows[0] as Medication;
  } catch (err) {
    throw new Error('Failed to create medication.');
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM medications 
    WHERE id=${id}
    `;
    return Response.json({ message: `Medication ${id} deleted successfully` });
  } catch (err) {
    throw new Error('Failed to delete medication.');
  }
}
