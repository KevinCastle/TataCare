import { create } from 'zustand';
import { get } from 'http';
import { Contact } from '../api/contacts/types';

type ContactState = {
    contacts: Contact[]
}

type ContactActions = {
    get: (elderId: string) => void,
    add: (contact: Contact) => void,
    remove: (contact: Contact) => void
}

type ContactStore = ContactState & ContactActions

const defaultInitState: ContactState = {
  contacts: [],
};

export const useContactStore = create<ContactStore>((set) => ({
  ...defaultInitState,
  get: async (elderId) => {
    try {
      const response = await fetch(`/api/contacts?elderId=${elderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const contacts = await response.json();
      set({ contacts });
    } catch (error) {
      console.error('Failed to fetch contact:', error);
    }
  },
  add: async (contact: Contact) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  },
  remove: async (contact: Contact) => {
    try {
      const response = await fetch(`/api/contacts?id=${contact.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact.id),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await get(contact.elder_id);
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  },
}));
