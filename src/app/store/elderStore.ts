import { create } from 'zustand';
import { Elder } from '../api/elders/types';

type ElderState = {
  elders: Elder[],
  selectedElder: Elder | null
}

type ElderActions = {
  getAll: () => void,
  getElder: (id: string) => void,
  add: (elder: Elder) => void,
  edit: (id: string, elder: Elder) => void,
  remove: (id: string) => void
}

type ElderStore = ElderState & ElderActions

const defaultInitState: ElderState = {
  elders: [],
  selectedElder: null,
};

export const useElderStore = create<ElderStore>((set, get) => ({
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
      throw new Error('Failed to fetch elders:');
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
      throw new Error('Failed to update elder:');
    }
  },
  add: async (elder: Elder) => {
    try {
      const response = await fetch('/api/elders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elder),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      get().getAll();
    } catch (error) {
      throw new Error('Failed to update elder:');
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
      get().getElder(id);
    } catch (error) {
      throw new Error('Failed to update elder:');
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
      set({ selectedElder: null });
    } catch (error) {
      throw new Error('Failed to update elder');
    }
  },
}));
