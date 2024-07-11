import { create } from 'zustand';
import { Comment } from '../api/comments/types';

type CommentState = {
    comments: Comment[],
    lastComment: Comment | null
}

type CommentActions = {
    get: (elderId: string) => void,
    getLast: (elderId: string) => void,
    add: (comment: Comment) => void,
    remove: (comment: Comment) => void
}

type CommentStore = CommentState & CommentActions

const defaultInitState: CommentState = {
  comments: [],
  lastComment: null,
};

export const useCommentStore = create<CommentStore>((set, get) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      const response = await fetch(`/api/comments?elderId=${elderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const comments = await response.json();
      comments.sort((a: Comment, b: Comment) => new Date(b.date).getTime() - new Date(a.date).getTime());
      set({ comments });
    } catch (error) {
      throw new Error('Failed to fetch comment:');
    }
  },
  getLast: async (elderId) => {
    try {
      const response = await fetch(`/api/comments?elderId=${elderId}&latest=true`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const lastComment = await response.json();
      set({ lastComment });
    } catch (error) {
      throw new Error('Failed to fetch comment:');
    }
  },
  add: async (comment: Comment) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      get().get(comment.elder_id);
    } catch (error) {
      throw new Error('Failed to update comment:');
    }
  },
  edit: async (comment: Comment) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      get().get(comment.elder_id);
    } catch (error) {
      throw new Error('Failed to update comment');
    }
  },
  remove: async (comment: Comment) => {
    try {
      const response = await fetch(`/api/comments?id=${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment.id),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await get().get(comment.elder_id);
    } catch (error) {
      throw new Error('Failed to update comment:');
    }
  },
}));
