import { Elder } from '@/app/api/elders/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
//   const elders = await fetchElders();
//   return Response.json(elders);
  noStore();
  try {
    const data = await sql<Elder>`
      SELECT
        *
      FROM elders
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
    const elder = await request.json();

    const keys = (Object.keys(elder)).join(', ');
    const placeholders = Object.keys(elder).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(elder);

    const query = `
      INSERT INTO elders (${keys})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const data = await sql.query<Elder>(query, values);

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to create elder. ${err}`);
  }
}
