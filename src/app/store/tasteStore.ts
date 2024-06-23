import { create } from 'zustand';
import { get } from 'http';
import { Taste } from '../api/tastes/types';

type TasteState = {
    tastes: Taste[]
}

type TasteActions = {
    get: (elderId: string) => void,
    add: (taste: Taste) => void,
    edit: (taste: Taste) => void,
    remove: (taste: Taste) => void
}

type TasteStore = TasteState & TasteActions

const defaultInitState: TasteState = {
  tastes: [],
};

export const useTasteStore = create<TasteStore>((set) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      const response = await fetch(`/api/tastes?elderId=${elderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tastes = await response.json();
      set({ tastes });
    } catch (error) {
      throw new Error('Failed to fetch taste:');
    }
  },
  add: async (taste: Taste) => {
    try {
      const response = await fetch('/api/tastes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taste),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      throw new Error('Failed to update taste:');
    }
  },
  edit: async (taste: Taste) => {
    try {
      const response = await fetch('/api/tastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taste),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      throw new Error('Failed to update elder:');
    }
  },
  remove: async (taste: Taste) => {
    try {
      const response = await fetch(`/api/tastes?id=${taste.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taste.id),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await get(taste.elder_id);
    } catch (error) {
      throw new Error('Failed to update taste:');
    }
  },
}));
