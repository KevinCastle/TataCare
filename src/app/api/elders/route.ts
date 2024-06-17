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
