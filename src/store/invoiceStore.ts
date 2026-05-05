import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice, InvoiceStatus, LineItem } from '../types';

function nanoid() {
  return Math.random().toString(36).slice(2, 11);
}

function computeTotals(lineItems: LineItem[], taxRate: number) {
  const subtotal = lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (data: Omit<Invoice, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'subtotal' | 'taxAmount' | 'total'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateStatus: (id: string, status: InvoiceStatus) => void;
  getNextNumber: () => string;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],

      getNextNumber: () => {
        const year = new Date().getFullYear();
        const count = get().invoices.filter(i => i.number.startsWith(`INV-${year}`)).length + 1;
        return `INV-${year}-${String(count).padStart(3, '0')}`;
      },

      addInvoice: (data) => {
        const totals = computeTotals(data.lineItems, data.taxRate);
        const invoice: Invoice = {
          ...data, ...totals,
          id: nanoid(),
          number: get().getNextNumber(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(s => ({ invoices: [invoice, ...s.invoices] }));
        return invoice;
      },

      updateInvoice: (id, updates) => {
        set(s => ({
          invoices: s.invoices.map(inv => {
            if (inv.id !== id) return inv;
            const merged = { ...inv, ...updates, updatedAt: new Date().toISOString() };
            return { ...merged, ...computeTotals(merged.lineItems, merged.taxRate) };
          }),
        }));
      },

      deleteInvoice: (id) => set(s => ({ invoices: s.invoices.filter(i => i.id !== id) })),

      updateStatus: (id, status) => set(s => ({
        invoices: s.invoices.map(i => i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i),
      })),
    }),
    { name: 'ht-invoice-data' }
  )
);
