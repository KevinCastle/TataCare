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
        birthdate,
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

export async function getElderById(id: string | string[]) {
  let elderId = '';
  if (Array.isArray(id)) {
    [elderId] = Array.isArray(id) ? id : [id];
  }
  noStore();
  try {
    const elder = await sql<Elder>`
      SELECT
        *
      FROM elders
      WHERE id=${elderId}
    `;

    return elder.rows[0] as Elder;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch elder.');
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
