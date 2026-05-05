export type Currency = 'HTG' | 'USD' | 'EUR';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type Language = 'fr' | 'en' | 'ht';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  status: InvoiceStatus;
  currency: Currency;
  lineItems: LineItem[];
  taxRate: number;
  notes?: string;
  issueDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface Settings {
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  businessAddress?: string;
  defaultCurrency: Currency;
  defaultTaxRate: number;
  language: Language;
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  HTG: 'G',
  USD: '$',
  EUR: '€',
};

export const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: '#8A8691',
  sent: '#3B82F6',
  paid: '#22C55E',
  overdue: '#EF4444',
};
