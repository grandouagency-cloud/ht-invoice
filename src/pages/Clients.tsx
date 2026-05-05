import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClientStore } from '../store/clientStore';
import { useInvoiceStore } from '../store/invoiceStore';
import { Client } from '../types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function ClientModal({ client, onClose }: { client?: Client; onClose: () => void }) {
  const { t } = useTranslation();
  const { addClient, updateClient } = useClientStore();
  const [form, setForm] = useState({
    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    company: client?.company ?? '',
    address: client?.address ?? '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (client) updateClient(client.id, form);
    else addClient(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card p-6 w-full max-w-md animate-in space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">{client ? t('actions.edit') : t('client.new')}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white"><X size={18} /></button>
        </div>
        {[
          { key: 'name', label: t('client.name'), required: true },
          { key: 'email', label: t('client.email'), required: true },
          { key: 'phone', label: t('client.phone') },
          { key: 'company', label: t('client.company') },
          { key: 'address', label: t('client.address') },
        ].map(({ key, label, required }) => (
          <div key={key}>
            <label className="label">{label}{required && ' *'}</label>
            <input
              className="input"
              value={(form as any)[key]}
              onChange={e => set(key, e.target.value)}
              type={key === 'email' ? 'email' : 'text'}
            />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button className="btn-ghost flex-1" onClick={onClose}>{t('actions.cancel')}</button>
          <button className="btn-primary flex-1" onClick={handleSave}>{t('actions.save')}</button>
        </div>
      </div>
    </div>
  );
}

export default function Clients() {
  const { t } = useTranslation();
  const { clients, deleteClient } = useClientStore();
  const { invoices } = useInvoiceStore();
  const [modal, setModal] = useState<{ open: boolean; client?: Client }>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invoiceCount = (clientId: string) => invoices.filter(i => i.clientId === clientId).length;

  return (
    <div className="space-y-5 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">{t('nav.clients')}</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setModal({ open: true })}>
          <Plus size={16} /> {t('client.new')}
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="card p-12 text-center text-dark-muted">
          <div className="text-4xl mb-3">👥</div>
          <p>{t('empty.clients')}</p>
          <button className="btn-primary mt-4 mx-auto" onClick={() => setModal({ open: true })}>{t('client.new')}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => (
            <div key={client.id} className="card p-5 space-y-4 hover:border-dark-muted transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-sm">
                    {initials(client.name)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{client.name}</p>
                    {client.company && <p className="text-dark-muted text-xs">{client.company}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal({ open: true, client })} className="p-1.5 rounded hover:bg-dark-border transition-colors text-dark-muted hover:text-white">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteId(client.id)} className="p-1.5 rounded hover:bg-red-500/20 transition-colors text-dark-muted hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-dark-muted">{client.email}</p>
                {client.phone && <p className="text-dark-muted">{client.phone}</p>}
                {client.address && <p className="text-dark-muted text-xs">{client.address}</p>}
              </div>
              <div className="border-t border-dark-border pt-3">
                <span className="text-xs text-dark-muted">
                  {invoiceCount(client.id)} {t('client.invoiceCount')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && <ClientModal client={modal.client} onClose={() => setModal({ open: false })} />}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full animate-in">
            <h3 className="text-white font-semibold mb-2">{t('actions.confirm')}</h3>
            <p className="text-dark-muted text-sm mb-5">This client will be permanently deleted.</p>
            <div className="flex gap-3">
              <button className="btn-ghost flex-1" onClick={() => setDeleteId(null)}>{t('actions.cancel')}</button>
              <button className="btn-danger flex-1" onClick={() => { deleteClient(deleteId); setDeleteId(null); }}>{t('actions.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
