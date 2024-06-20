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
    const requestBody = await request.json();
    const { contact } = requestBody;

    const keys = Object.keys(contact).join(', ');
    const values = Object.values(contact).join(', ');

    const result = await sql<Contact>`
      INSERT INTO contacts (${keys})
        VALUES (${values})
    `;

    return new Response(JSON.stringify(result.rows[0]), {
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
    const { contact } = requestBody;
    const { searchParams } = request.nextUrl;
    const elderId = searchParams.get('elderId');

    const { id, ...contactData } = contact;
    const keys = Object.keys(contactData);
    const values = Object.values(contactData);
    const updates = keys.map((key, index) => `${key} = ${values[index]}`).join(', ');
    const result = await sql<Contact>`
      UPDATE contact
      SET ${updates}
      WHERE elder_id=${elderId} AND id=${id}
    `;

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to edit contact.');
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
