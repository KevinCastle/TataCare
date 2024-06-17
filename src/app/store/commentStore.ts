import { create } from 'zustand';
import { get } from 'http';
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

export const useCommentStore = create<CommentStore>((set) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      const response = await fetch(`/api/comments?elderId=${elderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const comments = await response.json();
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
    } catch (error) {
      throw new Error('Failed to update comment:');
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
      await get(comment.elder_id);
    } catch (error) {
      throw new Error('Failed to update comment:');
    }
  },
}));
