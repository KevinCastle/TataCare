import { create } from 'zustand';
import { User } from '../api/user/types';

type responseType = {
  success: boolean,
  errorMessage: string,
}

type UserState = {
  user: User | null,
}

type UserActions = {
  get: () => void,
  add: (user: User) => Promise<responseType>,
  getById: (userId: string) => Promise<User | null>,
}

type UserStore = UserState & UserActions

const defaultInitState: UserState = {
  user: null,
};

export const useUserStore = create<UserStore>((set) => ({
  ...defaultInitState,
  get: async () => {
    const endpoint = '/api/user';
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const user = await response.json();
      set({ user });
    } catch (error) {
      throw new Error('Failed to fetch user:');
    }
  },
  add: async (user: User) => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        if (errorResponse.error === 'El correo ingresado ya está registrado.') {
          return { success: false, errorMessage: errorResponse.error };
        }
        throw new Error('Network response was not ok');
      }
      await response.json();
      return { success: true, errorMessage: '' };
    } catch (error) {
      return { success: false, errorMessage: 'Error al registrar. Intente más tarde.' };
    }
  },
  getById: async (userId: string) => {
    const endpoint = `/api/user?userId=${userId}`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const user = await response.json();
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user:');
    }
  },
}));
