import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInvoiceStore } from '../store';
import { useClientStore } from '../store';
import { useSettingsStore } from '../store';
import { Currency, LineItem } from '../types';
import { CURRENCY_SYMBOLS } from '../types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

function nanoid() { return Math.random().toString(36).slice(2, 11); }

const emptyLine = (): LineItem => ({ id: nanoid(), description: '', quantity: 1, unitPrice: 0 });

export default function InvoiceNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { invoices, addInvoice, updateInvoice } = useInvoiceStore();
  const { clients } = useClientStore();
  const { settings } = useSettingsStore();

  const existing = isEdit ? invoices.find(i => i.id === id) : null;

  const [clientId, setClientId] = useState(existing?.clientId ?? '');
  const [currency, setCurrency] = useState<Currency>(existing?.currency ?? settings.defaultCurrency);
  const [issueDate, setIssueDate] = useState(existing?.issueDate ?? new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '');
  const [taxRate, setTaxRate] = useState(existing?.taxRate ?? settings.defaultTaxRate);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [lineItems, setLineItems] = useState<LineItem[]>(existing?.lineItems ?? [emptyLine()]);
  const [status, setStatus] = useState<'draft' | 'sent'>(existing?.status === 'sent' ? 'sent' : 'draft');

  const subtotal = lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const sym = CURRENCY_SYMBOLS[currency];

  const updateLine = (lineId: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(l => l.id === lineId ? { ...l, [field]: value } : l));
  };
  const removeLine = (lineId: string) => setLineItems(prev => prev.filter(l => l.id !== lineId));
  const addLine = () => setLineItems(prev => [...prev, emptyLine()]);

  const handleSave = (saveStatus: 'draft' | 'sent') => {
    const data = { clientId, currency, issueDate, dueDate, taxRate, notes, lineItems, status: saveStatus };
    if (isEdit && existing) {
      updateInvoice(existing.id, data);
      navigate(`/invoices/${existing.id}`);
    } else {
      const inv = addInvoice(data);
      navigate(`/invoices/${inv.id}`);
    }
  };

  return (
    <div className="space-y-5 animate-in max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-dark-2 transition-colors text-dark-muted hover:text-white">
          <ArrowLeft size={16} />
        </button>
        <h1 className="font-display text-2xl font-bold text-white">
          {isEdit ? t('invoice.edit') : t('invoice.new')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">
          {/* Client + dates */}
          <div className="card p-5 space-y-4">
            <div>
              <label className="label">{t('invoice.client')}</label>
              <select className="input" value={clientId} onChange={e => setClientId(e.target.value)}>
                <option value="">— {t('invoice.client')} —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{t('invoice.issueDate')}</label>
                <input type="date" className="input" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
              </div>
              <div>
                <label className="label">{t('invoice.dueDate')}</label>
                <input type="date" className="input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">{t('invoice.currency')}</label>
              <select className="input" value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
                <option value="HTG">🇭🇹 HTG — Gourde haïtienne</option>
                <option value="USD">🇺🇸 USD — US Dollar</option>
                <option value="EUR">🇪🇺 EUR — Euro</option>
              </select>
            </div>
          </div>

          {/* Line items */}
          <div className="card p-5 space-y-3">
            <p className="text-white font-medium">{t('invoice.lineItems')}</p>
            <div className="grid grid-cols-12 gap-2 text-xs text-dark-muted uppercase tracking-wider px-1">
              <div className="col-span-5">{t('invoice.description')}</div>
              <div className="col-span-2 text-right">{t('invoice.qty')}</div>
              <div className="col-span-3 text-right">{t('invoice.unitPrice')}</div>
              <div className="col-span-1 text-right">{t('invoice.amount')}</div>
              <div className="col-span-1" />
            </div>
            {lineItems.map(line => (
              <div key={line.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="input col-span-5"
                  placeholder={t('invoice.description')}
                  value={line.description}
                  onChange={e => updateLine(line.id, 'description', e.target.value)}
                />
                <input
                  type="number" min="1" className="input col-span-2 text-right"
                  value={line.quantity}
                  onChange={e => updateLine(line.id, 'quantity', Number(e.target.value))}
                />
                <input
                  type="number" min="0" step="0.01" className="input col-span-3 text-right"
                  value={line.unitPrice}
                  onChange={e => updateLine(line.id, 'unitPrice', Number(e.target.value))}
                />
                <div className="col-span-1 text-right text-sm text-white">
                  {(line.quantity * line.unitPrice).toLocaleString()}
                </div>
                <button onClick={() => removeLine(line.id)} className="col-span-1 flex justify-center text-dark-muted hover:text-red-400 transition-colors p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={addLine} className="flex items-center gap-1 text-brand text-sm hover:text-brand-light transition-colors mt-2">
              <Plus size={14} /> {t('invoice.addLine')}
            </button>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <label className="label">{t('invoice.notes')}</label>
            <textarea className="input min-h-[80px] resize-none" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Right col — summary */}
        <div className="space-y-5">
          <div className="card p-5 space-y-3">
            <div>
              <label className="label">{t('invoice.tax')} (%)</label>
              <input type="number" min="0" max="100" className="input" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} />
            </div>
            <div className="border-t border-dark-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-muted">{t('invoice.subtotal')}</span>
                <span className="text-white">{sym} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-muted">{t('invoice.tax')} {taxRate}%</span>
                <span className="text-white">{sym} {taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-dark-border pt-2">
                <span className="font-bold text-white">{t('invoice.total')}</span>
                <span className="font-bold text-brand text-lg">{sym} {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button className="btn-primary w-full pulse-glow" onClick={() => handleSave('sent')}>
              {t('invoice.markSent')}
            </button>
            <button className="btn-ghost w-full" onClick={() => handleSave('draft')}>
              {t('actions.save')} ({t('invoice.statuses.draft')})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
