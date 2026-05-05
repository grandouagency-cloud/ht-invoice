import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInvoiceStore } from '../store';
import { useClientStore } from '../store';
import { useSettingsStore } from '../store';
import { CURRENCY_SYMBOLS, STATUS_COLORS } from '../types';
import { ArrowLeft, Download, Mail, Pencil, Trash2, CheckCircle, Send } from 'lucide-react';
import { useState } from 'react';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { invoices, updateStatus, deleteInvoice } = useInvoiceStore();
  const { clients } = useClientStore();
  const { settings } = useSettingsStore();
  const [showDelete, setShowDelete] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const inv = invoices.find(i => i.id === id);
  if (!inv) return <div className="text-dark-muted p-8 text-center">Invoice not found.</div>;

  const client = clients.find(c => c.id === inv.clientId);
  const sym = CURRENCY_SYMBOLS[inv.currency];
  const color = STATUS_COLORS[inv.status];

  const handlePDF = async () => {
    const apiUrl = 'http://localhost:3001';
    if (true) {
      alert('PDF ready (demo mode — connect backend for real PDF)');
      return;
    }
    const res = await fetch(`${apiUrl}/api/pdf/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice: inv, client, settings }),
    });
    if (!res.ok) { alert('PDF generation failed'); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${inv.number}.pdf`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleEmail = async () => {
    if (true) {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
      return;
    }
    const apiUrl = 'http://localhost:3001';
    await fetch(`${apiUrl}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: client?.email, invoiceNumber: inv.number,
        clientName: client?.name, total: inv.total,
        currency: sym, dueDate: inv.dueDate,
      }),
    });
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleDelete = () => {
    deleteInvoice(inv.id);
    navigate('/invoices');
  };

  return (
    <div className="space-y-5 animate-in max-w-4xl">
      {/* Top actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-dark-2 transition-colors text-dark-muted hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {inv.status !== 'paid' && (
            <button onClick={() => updateStatus(inv.id, 'paid')} className="btn-ghost flex items-center gap-2 text-green-400 border-green-500/30 hover:bg-green-500/10">
              <CheckCircle size={14} /> {t('invoice.markPaid')}
            </button>
          )}
          {inv.status === 'draft' && (
            <button onClick={() => updateStatus(inv.id, 'sent')} className="btn-ghost flex items-center gap-2">
              <Send size={14} /> {t('invoice.markSent')}
            </button>
          )}
          <button onClick={handlePDF} className="btn-ghost flex items-center gap-2">
            <Download size={14} /> {t('invoice.download')}
          </button>
          <button onClick={handleEmail} className="btn-ghost flex items-center gap-2">
            <Mail size={14} /> {emailSent ? '✓ Sent!' : t('invoice.sendEmail')}
          </button>
          <button onClick={() => navigate(`/invoices/${inv.id}/edit`)} className="btn-ghost flex items-center gap-2">
            <Pencil size={14} /> {t('actions.edit')}
          </button>
          <button onClick={() => setShowDelete(true)} className="btn-danger flex items-center gap-2">
            <Trash2 size={14} /> {t('actions.delete')}
          </button>
        </div>
      </div>

      {/* Invoice preview */}
      <div className="card p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-display text-2xl font-bold text-white">{settings.businessName}</p>
            <p className="text-dark-muted text-sm mt-1">{settings.businessEmail}</p>
            {settings.businessPhone && <p className="text-dark-muted text-sm">{settings.businessPhone}</p>}
            {settings.businessAddress && <p className="text-dark-muted text-sm">{settings.businessAddress}</p>}
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-brand">INVOICE</p>
            <p className="text-white font-medium mt-1">{inv.number}</p>
            <span className="status-badge mt-2 inline-flex" style={{ background: `${color}20`, color }}>
              {t(`invoice.statuses.${inv.status}`)}
            </span>
          </div>
        </div>

        {/* Dates + client */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="label mb-2">{t('invoice.client')}</p>
            <p className="text-white font-medium">{client?.name ?? '—'}</p>
            {client?.company && <p className="text-dark-muted text-sm">{client.company}</p>}
            {client?.email && <p className="text-dark-muted text-sm">{client.email}</p>}
            {client?.address && <p className="text-dark-muted text-sm">{client.address}</p>}
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <p className="text-dark-muted text-sm">{t('invoice.issueDate')}: <span className="text-white">{inv.issueDate}</span></p>
              <p className="text-dark-muted text-sm">{t('invoice.dueDate')}: <span className="text-white">{inv.dueDate}</span></p>
              <p className="text-dark-muted text-sm">{t('invoice.currency')}: <span className="text-white">{inv.currency}</span></p>
            </div>
          </div>
        </div>

        {/* Line items table */}
        <div>
          <div className="grid grid-cols-12 gap-2 border-b border-dark-border pb-2 text-xs text-dark-muted uppercase tracking-wider">
            <div className="col-span-5">{t('invoice.description')}</div>
            <div className="col-span-2 text-right">{t('invoice.qty')}</div>
            <div className="col-span-3 text-right">{t('invoice.unitPrice')}</div>
            <div className="col-span-2 text-right">{t('invoice.amount')}</div>
          </div>
          {inv.lineItems.map(line => (
            <div key={line.id} className="grid grid-cols-12 gap-2 py-2.5 border-b border-dark-border/50 text-sm">
              <div className="col-span-5 text-white">{line.description}</div>
              <div className="col-span-2 text-right text-dark-muted">{line.quantity}</div>
              <div className="col-span-3 text-right text-dark-muted">{sym} {line.unitPrice.toLocaleString()}</div>
              <div className="col-span-2 text-right text-white font-medium">{sym} {(line.quantity * line.unitPrice).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-muted">{t('invoice.subtotal')}</span>
              <span className="text-white">{sym} {inv.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-muted">{t('invoice.tax')} ({inv.taxRate}%)</span>
              <span className="text-white">{sym} {inv.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-dark-border pt-2">
              <span className="font-bold text-white text-lg">{t('invoice.total')}</span>
              <span className="font-bold text-brand text-2xl">{sym} {inv.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {inv.notes && (
          <div className="border-t border-dark-border pt-4">
            <p className="label mb-1">{t('invoice.notes')}</p>
            <p className="text-dark-muted text-sm whitespace-pre-line">{inv.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-dark-border pt-4 text-center">
          <p className="text-dark-muted text-xs">Generated by <span className="text-brand">ht-invoice</span> · github.com/YOUR_USERNAME/ht-invoice</p>
        </div>
      </div>

      {/* Delete modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full animate-in">
            <h3 className="text-white font-semibold mb-2">{t('actions.confirm')}</h3>
            <p className="text-dark-muted text-sm mb-5">Invoice {inv.number} will be permanently deleted.</p>
            <div className="flex gap-3">
              <button className="btn-ghost flex-1" onClick={() => setShowDelete(false)}>{t('actions.cancel')}</button>
              <button className="btn-danger flex-1" onClick={handleDelete}>{t('actions.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
