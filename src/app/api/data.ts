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
        *
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

export async function getElderById(id: string) {
  noStore();
  try {
    const elder = await sql<Elder>`
      SELECT
        *
      FROM elders
      WHERE id=${id}
    `;

    return elder.rows[0] as Elder;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch elder.');
  }
}

export async function addElder(elder: Elder) {
  noStore();
  const keys = Object.keys(elder).join(', ');
  const values = Object.values(elder).join(', ');
  try {
    const elder = await sql<Elder>`
      INSERT INTO elders (${keys})
        VALUES (${values})
    `;

    return elder.rows[0] as Elder;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create elder.');
  }
}

export async function updateElder(id: string, key: string, data: string | boolean | number) {
  noStore();
  try {
    const elder = await sql<Elder>`
      UPDATE elders
      SET ${key}=${data}
      WHERE id=${id}
    `;

    return elder.rows[0] as Elder;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch elder.');
  }
}

export async function deleteElder(id: string) {
  try {
    const result = await sql`
      DELETE FROM elders
      WHERE id=${id}
      RETURNING *;
    `;
    if (result.rowCount === 0) {
      throw new Error('Elder not found.');
    }
    return result.rows[0] as Elder; // Returns the deleted elder's data
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to delete elder.');
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
