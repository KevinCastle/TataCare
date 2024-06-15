import { create } from 'zustand';
import { get } from 'http';
import { Allergy } from '../api/allergies/types';

type AllergyState = {
    allergies: Allergy[]
}

type AllergyActions = {
    get: (elderId: string) => void,
    add: (allergy: Allergy) => void,
    remove: (allergy: Allergy) => void
}

type AllergyStore = AllergyState & AllergyActions

const defaultInitState: AllergyState = {
  allergies: [],
};

export const useAllergyStore = create<AllergyStore>((set) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      const response = await fetch(`/api/allergies?elderId=${elderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const allergies = await response.json();
      set({ allergies });
    } catch (error) {
      console.error('Failed to fetch allergy:', error);
    }
  },
  add: async (allergy: Allergy) => {
    try {
      const response = await fetch('/api/allergies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allergy),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Failed to update allergy:', error);
    }
  },
  remove: async (allergy: Allergy) => {
    try {
      const response = await fetch(`/api/allergies?id=${allergy.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allergy.id),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await get(allergy.elder_id);
    } catch (error) {
      console.error('Failed to update allergy:', error);
    }
  },
}));
