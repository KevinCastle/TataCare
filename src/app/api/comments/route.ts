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
    const requestBody = await request.json();
    const { comment } = requestBody;

    const keys = Object.keys(comment).join(', ');
    const values = Object.values(comment).join(', ');

    const result = await sql<Comment>`
      INSERT INTO comments (${keys})
        VALUES (${values})
    `;

    return result.rows[0] as Comment;
  } catch (err) {
    throw new Error('Failed to create comment.');
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
