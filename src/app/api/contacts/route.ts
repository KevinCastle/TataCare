import { Contact } from '@/app/api/contacts/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const elderId = searchParams.get('elderId');
    const data = await sql` SELECT * FROM contact WHERE elder_id=${elderId}`;
    const contacts = data.rows;
    return Response.json(contacts);
  } catch (err) {
    throw new Error('Failed to fetch contacts.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const contact = await request.json();

    const keys = (Object.keys(contact)).join(', ');
    const placeholders = Object.keys(contact).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(contact);

    const query = `
      INSERT INTO contact (${keys})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const data = await sql.query<Contact>(query, values);

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to create contact.');
  }
}

export async function POST(request: NextRequest) {
  noStore();

  try {
    const requestBody = await request.json();

    const { id, ...contactData } = requestBody;
    const updates = Object.keys(contactData).map((key, index) => `${key} = $${index + 2}`).join(', ');

    const values = Object.values(contactData);
    values.unshift(id);

    const query = `
      UPDATE contact
      SET ${updates}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await sql.query(query, values);

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to edit contact. ${err}`);
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM contacts 
    WHERE id=${id}
    `;
    return Response.json({ message: `Contact ${id} deleted successfully` });
  } catch (err) {
    throw new Error('Failed to delete contact.');
  }
}
