import { create } from 'zustand';
import { Medication } from '../api/medications/types';

type MedicationState = {
    medications: Medication[]
}

type MedicationActions = {
    get: (elderId: string) => void,
    add: (medication: Medication) => void,
    edit: (medication: Medication) => void,
    remove: (medication: Medication) => void
}

type MedicationStore = MedicationState & MedicationActions

const defaultInitState: MedicationState = {
  medications: [],
};

export const useMedicationStore = create<MedicationStore>((set, get) => ({
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
  edit: async (medication: Medication) => {
    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medication),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      get().get(medication.elder_id);
    } catch (error) {
      throw new Error(`Failed to update medication, ${error}`);
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
      await get().get(medication.elder_id);
    } catch (error) {
      throw new Error('Failed to update medication');
    }
  },
}));
