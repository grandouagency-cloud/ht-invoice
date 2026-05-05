import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client } from '../types';

function nanoid() {
  return Math.random().toString(36).slice(2, 11);
}

interface ClientStore {
  clients: Client[];
  addClient: (data: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      clients: [],
      addClient: (data) => {
        const client: Client = { ...data, id: nanoid(), createdAt: new Date().toISOString() };
        set(s => ({ clients: [client, ...s.clients] }));
        return client;
      },
      updateClient: (id, updates) => set(s => ({
        clients: s.clients.map(c => c.id === id ? { ...c, ...updates } : c),
      })),
      deleteClient: (id) => set(s => ({ clients: s.clients.filter(c => c.id !== id) })),
    }),
    { name: 'ht-clients-data' }
  )
);
