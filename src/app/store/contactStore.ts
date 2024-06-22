import { create } from 'zustand';
import { get } from 'http';
import { Contact } from '../api/contacts/types';

type ContactState = {
    contacts: Contact[]
}

type ContactActions = {
    get: (elderId: string) => void,
    add: (contact: Contact) => void,
    edit: (elderId: string, contact: Contact) => void,
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
      throw new Error('Failed to fetch contact:');
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
      throw new Error('Failed to update contact');
    }
  },
  edit: async (elderId: string, contact: Contact) => {
    try {
      const response = await fetch(`/api/contacts?elderId=${elderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      throw new Error('Failed to update contact');
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
      throw new Error('Failed to update contact');
    }
  },
}));
