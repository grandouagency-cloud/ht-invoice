import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice, Client, Settings, InvoiceStatus, LineItem } from '../types';

function uid() { return Math.random().toString(36).slice(2, 11); }
function computeTotals(lineItems: LineItem[], taxRate: number) {
  const subtotal = lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}

// ---- Seed data ----
const SEED_CLIENTS: Client[] = [
  { id: 'demo-c1', name: 'Marie Desrosiers', email: 'marie@techhaiti.ht', company: 'Tech Haiti SARL', phone: '+509 3700-0001', address: 'Pétion-Ville, Ouest, Haïti', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'demo-c2', name: 'Jean-Baptiste Pierre', email: 'jb@design.ht', company: 'JB Studio', phone: '+509 3700-0002', address: 'Delmas 33, Port-au-Prince, Haïti', createdAt: '2025-02-01T10:00:00Z' },
  { id: 'demo-c3', name: 'Claudine Moreau', email: 'claudine@moreau.com', company: 'Moreau & Associés', phone: '+509 3800-0003', address: 'Bourdon, Port-au-Prince', createdAt: '2025-03-10T10:00:00Z' },
];
const SEED_INVOICES: Invoice[] = [
  { id: 'demo-i1', number: 'INV-2025-001', clientId: 'demo-c1', status: 'paid', currency: 'USD', taxRate: 10, issueDate: '2025-01-20', dueDate: '2025-02-05', lineItems: [{ id: 'l1', description: 'Website Design & Development', quantity: 1, unitPrice: 1500 }, { id: 'l2', description: 'Monthly Maintenance', quantity: 3, unitPrice: 100 }], subtotal: 1800, taxAmount: 180, total: 1980, notes: 'Thank you for your business!', createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-02-05T14:00:00Z' },
  { id: 'demo-i2', number: 'INV-2025-002', clientId: 'demo-c2', status: 'sent', currency: 'HTG', taxRate: 0, issueDate: '2025-03-01', dueDate: '2025-03-20', lineItems: [{ id: 'l3', description: 'Logo Design', quantity: 1, unitPrice: 25000 }, { id: 'l4', description: 'Brand Identity Kit', quantity: 1, unitPrice: 15000 }], subtotal: 40000, taxAmount: 0, total: 40000, notes: 'Mèsi pou konfyans ou. Peman aksepte pa MonCash.', createdAt: '2025-03-01T09:00:00Z', updatedAt: '2025-03-01T09:00:00Z' },
  { id: 'demo-i3', number: 'INV-2025-003', clientId: 'demo-c3', status: 'overdue', currency: 'USD', taxRate: 5, issueDate: '2025-02-01', dueDate: '2025-02-28', lineItems: [{ id: 'l5', description: 'Legal Consulting (5h)', quantity: 5, unitPrice: 120 }, { id: 'l6', description: 'Document Review', quantity: 1, unitPrice: 200 }], subtotal: 800, taxAmount: 40, total: 840, createdAt: '2025-02-01T09:00:00Z', updatedAt: '2025-02-01T09:00:00Z' },
  { id: 'demo-i4', number: 'INV-2025-004', clientId: 'demo-c1', status: 'draft', currency: 'EUR', taxRate: 20, issueDate: '2025-04-01', dueDate: '2025-04-30', lineItems: [{ id: 'l7', description: 'E-commerce Platform Development', quantity: 1, unitPrice: 3500 }], subtotal: 3500, taxAmount: 700, total: 4200, createdAt: '2025-04-01T09:00:00Z', updatedAt: '2025-04-01T09:00:00Z' },
];

// ---- Invoice Store ----
interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (data: Omit<Invoice, 'id'|'number'|'createdAt'|'updatedAt'|'subtotal'|'taxAmount'|'total'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateStatus: (id: string, status: InvoiceStatus) => void;
  getNextNumber: () => string;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: SEED_INVOICES,
      getNextNumber: () => {
        const year = new Date().getFullYear();
        const count = get().invoices.filter(i => i.number.startsWith(`INV-${year}`)).length + 1;
        return `INV-${year}-${String(count).padStart(3,'0')}`;
      },
      addInvoice: (data) => {
        const inv: Invoice = { ...data, ...computeTotals(data.lineItems, data.taxRate), id: uid(), number: get().getNextNumber(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set(s => ({ invoices: [inv, ...s.invoices] }));
        return inv;
      },
      updateInvoice: (id, updates) => set(s => ({ invoices: s.invoices.map(i => { if (i.id !== id) return i; const m = { ...i, ...updates, updatedAt: new Date().toISOString() }; return { ...m, ...computeTotals(m.lineItems, m.taxRate) }; }) })),
      deleteInvoice: (id) => set(s => ({ invoices: s.invoices.filter(i => i.id !== id) })),
      updateStatus: (id, status) => set(s => ({ invoices: s.invoices.map(i => i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i) })),
    }),
    { name: 'ht-demo-invoices' }
  )
);

// ---- Client Store ----
interface ClientStore {
  clients: Client[];
  addClient: (data: Omit<Client,'id'|'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}
export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      clients: SEED_CLIENTS,
      addClient: (data) => { const c: Client = { ...data, id: uid(), createdAt: new Date().toISOString() }; set(s => ({ clients: [c, ...s.clients] })); return c; },
      updateClient: (id, u) => set(s => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...u } : c) })),
      deleteClient: (id) => set(s => ({ clients: s.clients.filter(c => c.id !== id) })),
    }),
    { name: 'ht-demo-clients' }
  )
);

// ---- Settings Store ----
interface SettingsStore { settings: Settings; updateSettings: (u: Partial<Settings>) => void; }
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: { businessName: 'Mon Entreprise', businessEmail: 'contact@monentreprise.ht', businessPhone: '+509 3700-0000', businessAddress: 'Port-au-Prince, Haïti', defaultCurrency: 'HTG', defaultTaxRate: 0, language: 'fr' },
      updateSettings: (u) => set(s => ({ settings: { ...s.settings, ...u } })),
    }),
    { name: 'ht-demo-settings' }
  )
);
