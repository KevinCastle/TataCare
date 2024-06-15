import { create } from 'zustand';
// import { redirect } from 'next/navigation';
import { Elder } from '../api/elders/types';

type ElderState = {
  elders: Elder[],
  selectedElder: Elder | null
}

type ElderActions = {
  getAll: () => void,
  getElder: (id: string) => void,
  add: (id: string, elder: Elder) => void,
  edit: (id: string, elder: Elder) => void,
  remove: (id: string) => void
}

type ElderStore = ElderState & ElderActions

const defaultInitState: ElderState = {
  elders: [],
  selectedElder: null,
};

export const useElderStore = create<ElderStore>((set) => ({
  ...defaultInitState,
  getAll: async () => {
    try {
      const response = await fetch('api/elders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const elders = await response.json();
      set({ elders });
    } catch (error) {
      console.error('Failed to fetch elders:', error);
    }
  },
  getElder: async (id: string) => {
    try {
      const response = await fetch(`/api/elders/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const elder = await response.json();
      set({ selectedElder: elder });
    } catch (error) {
      console.error('Failed to update elder:', error);
    }
  },
  add: async (id: string, elder: Elder) => {
    try {
      const response = await fetch(`/api/elders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elder),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Failed to update elder:', error);
    }
  },
  edit: async (id: string, elder: Elder) => {
    try {
      const response = await fetch(`/api/elders/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elder),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Failed to update elder:', error);
    }
  },
  remove: async (id: string) => {
    try {
      const response = await fetch(`/api/elders/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const elder = await response.json();
      set({ selectedElder: elder });
    } catch (error) {
      console.error('Failed to update elder:', error);
    }
  },
}));
