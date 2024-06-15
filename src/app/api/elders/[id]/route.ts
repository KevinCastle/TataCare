import { Elder } from '@/app/api/elders/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  noStore();
  try {
    const data = await sql` SELECT * FROM elders WHERE id=${params.id}`;
    const elder = data.rows[0] as Elder;
    return Response.json(elder);
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch elder.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const requestBody = await request.json();
    const { elder } = requestBody;

    const keys = Object.keys(elder).join(', ');
    const values = Object.values(elder).join(', ');

    const result = await sql<Elder>`
      INSERT INTO elders (${keys})
        VALUES (${values})
    `;

    return result.rows[0] as Elder;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create elder.');
  }
}

export async function POST(request: Request) {
  noStore();

  try {
    const requestBody = await request.json();
    const { elder } = requestBody;

    const { id, ...elderData } = elder;
    const keys = Object.keys(elderData);
    const values = Object.values(elderData);
    const updates = keys.map((key, index) => `${key} = ${values[index]}`).join(', ');
    const result = await sql<Elder>`
      UPDATE elders
      SET ${updates}
      WHERE id=${id}
    `;

    return result.rows[0] as Elder;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create elder.');
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  noStore();
  try {
    await sql`
    DELETE FROM elders 
    WHERE id=${params.id}
    `;
    return Response.json({ message: `Elder ${params.id} deleted successfully` });
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to delete elder.');
  }
}
