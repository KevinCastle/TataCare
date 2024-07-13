import { create } from 'zustand';
import { PutBlobResult } from '@vercel/blob';
import { Elder, Shared } from '../api/elders/types';
import { useUserStore } from './userStore';

type ElderState = {
  elders: Elder[],
  selectedElder: Elder | null,
  isSharedLinkAvailable: boolean,
  sharedElder: Elder | null,
  loading: boolean,
}

type ElderActions = {
  getAll: () => void,
  getElder: (id: string) => Promise<Elder>,
  add: (elder: Elder) => Promise<Elder>,
  addSharedLink: (shared: Shared) => void,
  addElderShared: (id: string) => Promise<Elder | null>,
  edit: (id: string, elder: Elder) => void,
  editSharedLink: (sharedLink: Shared) => void,
  remove: (id: string) => void,
  uploadImage: (image: File) => Promise<PutBlobResult>
}

type ElderStore = ElderState & ElderActions

const defaultInitState: ElderState = {
  elders: [],
  selectedElder: null,
  isSharedLinkAvailable: true,
  loading: false,
  sharedElder: null,
};

export const useElderStore = create<ElderStore>((set, get) => ({
  ...defaultInitState,
  getAll: async () => {
    try {
      set({ loading: true });
      const response = await fetch('api/elders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const elders = await response.json();
      set({ elders });
    } catch (error) {
      throw new Error('Failed to fetch elders:');
    } finally {
      set({ loading: false });
    }
  },
  getElder: async (id: string): Promise<Elder> => {
    try {
      const response = await fetch(`/api/elders/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const elder = await response.json();
      set({ selectedElder: elder });
      return elder;
    } catch (error) {
      throw new Error('Failed to update elder:');
    }
  },
  add: async (elder: Elder): Promise<Elder> => {
    try {
      await useUserStore.getState().get();
      const userId = useUserStore.getState().user?.id;
      const body = { elder, userId };
      const response = await fetch('/api/elders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      get().getAll();
      const elderData = await response.json();
      return elderData;
    } catch (error) {
      throw new Error('Failed to update elder:');
    }
  },
  addSharedLink: async (shared: Shared) => {
    try {
      const response = await fetch('/api/elders/shared', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shared),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      throw new Error('Failed to update elder:');
    }
  },
  addElderShared: async (id: string): Promise<Elder | null> => {
    try {
      set({ loading: true });
      const response = await fetch(`/api/elders/shared?sharedId=${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const sharedLink = await response.json();

      const sharedLinkDate = new Date(sharedLink.date);
      const today = new Date();
      sharedLinkDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (sharedLink.used || sharedLinkDate < today) {
        set({ isSharedLinkAvailable: false });
        return null;
      }
      sharedLink.used = true;
      get().editSharedLink(sharedLink);
      const elder = await get().getElder(sharedLink.elder_id);
      get().add(elder);
      return elder;
    } catch (error) {
      throw new Error('Failed to update elder:');
    } finally {
      set({ loading: false });
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
  editSharedLink: async (sharedLink: Shared) => {
    try {
      const response = await fetch('/api/elders/shared', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sharedLink),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      throw new Error('Failed to update sharedLink:');
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
  uploadImage: async (image: File) => {
    try {
      const response = await fetch(`/api/avatar?filename=${image.name}`, {
        method: 'POST',
        body: image,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newBlob = (await response.json()) as PutBlobResult;
      return newBlob;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  },
}));
