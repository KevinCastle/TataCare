import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  User,
  Elder,
} from './definitions';

export async function fetchElders() {
  noStore();
  try {
    const data = await sql<Elder>`
      SELECT
        id,
        name,
        surname,
        age
      FROM elders
      ORDER BY name ASC
    `;

    const elders = data.rows;
    return elders;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all elders.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
