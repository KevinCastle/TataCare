import { Comment } from '@/app/api/comments/types';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const elderId = searchParams.get('elderId');
    const latest = searchParams.get('latest');
    if (latest === 'true') {
      const data = await sql`SELECT * FROM comment WHERE elder_id=${elderId} ORDER BY date DESC LIMIT 1`;
      const mostRecentComment = data.rows[0];
      return Response.json(mostRecentComment);
    }
    const data = await sql` SELECT * FROM comment WHERE elder_id=${elderId}`;
    const comments = data.rows;
    return Response.json(comments);
  } catch (err) {
    throw new Error('Failed to fetch comments.');
  }
}

export async function PUT(request: Request) {
  noStore();
  try {
    const comment = await request.json();

    const keys = (Object.keys(comment)).join(', ');
    const placeholders = Object.keys(comment).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(comment);

    const query = `
      INSERT INTO comment (${keys})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const data = await sql.query<Comment>(query, values);

    return new Response(JSON.stringify(data.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error('Failed to create comment.');
  }
}

export async function POST(request: NextRequest) {
  noStore();

  try {
    const requestBody = await request.json();

    const { id, ...commentData } = requestBody;
    const updates = Object.keys(commentData).map((key, index) => `${key} = $${index + 2}`).join(', ');

    const values = Object.values(commentData);
    values.unshift(id);

    const query = `
      UPDATE comment
      SET ${updates}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await sql.query(query, values);

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new Error(`Failed to edit comment. ${err}`);
  }
}

export async function DELETE(request: NextRequest) {
  noStore();
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    await sql`
    DELETE FROM comments 
    WHERE id=${id}
    `;
    return Response.json({ message: `Comment ${id} deleted successfully` });
  } catch (err) {
    throw new Error('Failed to delete comment.');
  }
}
