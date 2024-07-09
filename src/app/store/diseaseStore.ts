import { create } from 'zustand';
import { Disease } from '../api/diseases/types';

type DiseaseState = {
    diseases: Disease[]
}

type DiseaseActions = {
    get: (elderId: string) => void,
    add: (disease: Disease) => void,
  edit: (disease: Disease) => void,
    remove: (disease: Disease) => void
}

type DiseaseStore = DiseaseState & DiseaseActions

const defaultInitState: DiseaseState = {
  diseases: [],
};

export const useDiseaseStore = create<DiseaseStore>((set, get) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      const response = await fetch(`/api/diseases?elderId=${elderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const diseases = await response.json();
      set({ diseases });
    } catch (error) {
      throw new Error('Failed to fetch disease:');
    }
  },
  add: async (disease: Disease) => {
    try {
      const response = await fetch('/api/diseases', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disease),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      get().get(disease.elder_id);
    } catch (error) {
      throw new Error('Failed to update disease:');
    }
  },
  edit: async (disease: Disease) => {
    try {
      const response = await fetch('/api/diseases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disease),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      get().get(disease.elder_id);
    } catch (error) {
      throw new Error(`Failed to update disease, ${error}`);
    }
  },
  remove: async (disease: Disease) => {
    try {
      const response = await fetch(`/api/diseases?id=${disease.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disease.id),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await get().get(disease.elder_id);
    } catch (error) {
      throw new Error('Failed to update disease:');
    }
  },
}));
