import { create } from 'zustand';
import { get } from 'http';
import { Medication } from '../api/medications/types';

type MedicationState = {
    medications: Medication[]
}

type MedicationActions = {
    get: (elderId: string) => void,
    add: (medication: Medication) => void,
    edit: (elderId: string, medication: Medication) => void,
    remove: (medication: Medication) => void
}

type MedicationStore = MedicationState & MedicationActions

const defaultInitState: MedicationState = {
  medications: [],
};

export const useMedicationStore = create<MedicationStore>((set) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      const response = await fetch(`/api/medications?elderId=${elderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const medications = await response.json();
      set({ medications });
    } catch (error) {
      throw new Error('Failed to fetch medication');
    }
  },
  add: async (medication: Medication) => {
    try {
      const response = await fetch('/api/medications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medication),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      throw new Error('Failed to update medication');
    }
  },
  edit: async (elderId: string, medication: Medication) => {
    try {
      const response = await fetch(`/api/medications?elderId=${elderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medication),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      throw new Error('Failed to update medication');
    }
  },
  remove: async (medication: Medication) => {
    try {
      const response = await fetch(`/api/medications?id=${medication.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medication.id),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await get(medication.elder_id);
    } catch (error) {
      throw new Error('Failed to update medication');
    }
  },
}));
