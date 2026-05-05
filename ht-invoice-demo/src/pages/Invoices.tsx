import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInvoiceStore } from '../store';
import { useClientStore } from '../store';
import { useSettingsStore } from '../store';
import { CURRENCY_SYMBOLS, STATUS_COLORS, InvoiceStatus } from '../types';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';

const STATUSES: (InvoiceStatus | 'all')[] = ['all', 'draft', 'sent', 'paid', 'overdue'];

export default function Invoices() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invoices, deleteInvoice } = useInvoiceStore();
  const { clients } = useClientStore();
  const { settings } = useSettingsStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = invoices.filter(inv => {
    const client = clients.find(c => c.id === inv.clientId);
    const matchSearch = inv.number.toLowerCase().includes(search.toLowerCase()) ||
      (client?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-5 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">{t('nav.invoices')}</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/invoices/new')}>
          <Plus size={16} /> {t('invoice.new')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            className="input pl-9"
            placeholder={`${t('invoice.number')}, ${t('invoice.client')}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                statusFilter === s
                  ? 'bg-brand border-brand text-white'
                  : 'border-dark-border text-dark-muted hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : t(`invoice.statuses.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-dark-muted">
            <div className="text-4xl mb-3">🧾</div>
            <p>{t('empty.invoices')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  {['#', t('invoice.client'), t('invoice.issueDate'), t('invoice.dueDate'), t('invoice.total'), t('invoice.status'), ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs text-dark-muted font-medium uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filtered.map(inv => {
                  const client = clients.find(c => c.id === inv.clientId);
                  const sym = CURRENCY_SYMBOLS[inv.currency];
                  const color = STATUS_COLORS[inv.status];
                  return (
                    <tr key={inv.id} className="hover:bg-dark-2 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{inv.number}</td>
                      <td className="px-4 py-3 text-dark-muted">{client?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-dark-muted">{inv.issueDate}</td>
                      <td className="px-4 py-3 text-dark-muted">{inv.dueDate}</td>
                      <td className="px-4 py-3 text-white font-medium">{sym} {inv.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="status-badge" style={{ background: `${color}20`, color }}>
                          {t(`invoice.statuses.${inv.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/invoices/${inv.id}`)} className="p-1.5 rounded hover:bg-dark-border transition-colors text-dark-muted hover:text-white">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => navigate(`/invoices/${inv.id}/edit`)} className="p-1.5 rounded hover:bg-dark-border transition-colors text-dark-muted hover:text-white">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteId(inv.id)} className="p-1.5 rounded hover:bg-red-500/20 transition-colors text-dark-muted hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full animate-in">
            <h3 className="text-white font-semibold mb-2">{t('actions.confirm')}</h3>
            <p className="text-dark-muted text-sm mb-5">This invoice will be permanently deleted.</p>
            <div className="flex gap-3">
              <button className="btn-ghost flex-1" onClick={() => setDeleteId(null)}>{t('actions.cancel')}</button>
              <button className="btn-danger flex-1" onClick={() => handleDelete(deleteId)}>{t('actions.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
