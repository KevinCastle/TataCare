import { create } from 'zustand';
import { redirect } from 'next/navigation';
import { Elder } from '../api/definitions';
import {
  updateElder, deleteElder, addElder,
} from '../api/data';

type ElderState = {
  // elders: Elder[],
  selectedElder: Elder | null
}

type ElderActions = {
  // getAll: () => void,
  // setAll: (elders: Elder[]) => void,
  add: (newElder: Elder) => void,
  edit: (key: string, data: string | boolean | number) => void,
  remove: () => void
}

type ElderStore = ElderState & ElderActions

const defaultInitState: ElderState = {
  // elders: [],
  selectedElder: null,
};

export const useElderStore = create<ElderStore>((set, get) => ({
  ...defaultInitState,
  // getAll: async () => {
  //   try {
  //     const elders = await fetchElders();
  //     set({ elders });
  //   } catch (error) {
  //     console.error('Failed to fetch elders:', error);
  //   }
  // },
  // setAll: (elders) => set({ elders }),
  add: async (newElder) => {
    try {
      await addElder(newElder);
    } catch (error) {
      console.error('Failed to update elder:', error);
    }
  },
  edit: async (key, data) => {
    const state = get();
    if (!state.selectedElder) return;
    try {
      await updateElder(state.selectedElder.id, key, data);
      state.selectedElder = {
        ...state.selectedElder,
        [key]: data,
      };
      set({ selectedElder: state.selectedElder });
    } catch (error) {
      console.error('Failed to update elder:', error);
    }
  },
  remove: async () => {
    const { selectedElder } = get();
    if (!selectedElder) return;
    try {
      await deleteElder(selectedElder.id);
      await redirect('/app');
    } catch (error) {
      console.error('Failed to update elder:', error);
    }
  },
}));
