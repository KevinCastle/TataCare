import { create } from 'zustand';
import { User } from '../api/user/types';

type UserState = {
    user: User | null,
}

type UserActions = {
    get: (elderId?: string) => void,
}

type UserStore = UserState & UserActions

const defaultInitState: UserState = {
  user: null,
};

export const useUserStore = create<UserStore>((set) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      let response;
      if (elderId) {
        response = await fetch(`/api/user?elderId=${elderId}`);
      } else {
        response = await fetch('/api/user');
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const user = await response.json();
      set({ user });
    } catch (error) {
      throw new Error('Failed to fetch user:');
    }
  },
}));
