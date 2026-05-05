import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../store';
import { useClientStore } from '../store';
import { useSettingsStore } from '../store';
import { CURRENCY_SYMBOLS, STATUS_COLORS, Invoice } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="card p-5 flex items-center gap-4 animate-in">
      <div className="p-3 rounded-xl" style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-dark-muted text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white text-xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invoices } = useInvoiceStore();
  const { settings } = useSettingsStore();
  const sym = CURRENCY_SYMBOLS[settings.defaultCurrency];

  const paid = invoices.filter(i => i.status === 'paid');
  const pending = invoices.filter(i => i.status === 'sent');
  const overdue = invoices.filter(i => i.status === 'overdue');
  const totalRevenue = paid.reduce((s, i) => s + i.total, 0);

  // Build 6-month chart data
  const chartData = Array.from({ length: 6 }, (_, idx) => {
    const month = subMonths(new Date(), 5 - idx);
    const label = format(month, 'MMM');
    const interval = { start: startOfMonth(month), end: endOfMonth(month) };
    const revenue = invoices
      .filter(inv => inv.status === 'paid' && isWithinInterval(parseISO(inv.createdAt), interval))
      .reduce((s, inv) => s + inv.total, 0);
    return { label, revenue };
  });

  const recent = [...invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">{t('dashboard.title')}</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/invoices/new')}>
          <Plus size={16} /> {t('invoice.new')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.revenue')} value={`${sym} ${totalRevenue.toLocaleString()}`} icon={TrendingUp} color="#8248DE" />
        <StatCard label={t('dashboard.paid')} value={String(paid.length)} icon={CheckCircle} color="#22C55E" />
        <StatCard label={t('dashboard.pending')} value={String(pending.length)} icon={Clock} color="#3B82F6" />
        <StatCard label={t('dashboard.overdue')} value={String(overdue.length)} icon={AlertCircle} color="#EF4444" />
      </div>

      {/* Chart */}
      <div className="card p-5">
        <p className="text-dark-muted text-sm font-medium mb-4">{t('dashboard.revenueChart')}</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8A8691', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A8691', fontSize: 12 }} width={50} />
            <Tooltip
              contentStyle={{ background: '#1A1821', border: '1px solid #2C2932', borderRadius: 8, color: '#F2F2F2' }}
              cursor={{ fill: 'rgba(130,72,222,0.08)' }}
            />
            <Bar dataKey="revenue" fill="#8248DE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent invoices */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <p className="font-medium text-white">{t('dashboard.recentInvoices')}</p>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-dark-muted">
            <FileTextIcon />
            <p className="mt-2">{t('empty.invoices')}</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {recent.map(inv => (
              <InvoiceRow key={inv.id} inv={inv} sym={sym} onClick={() => navigate(`/invoices/${inv.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileTextIcon() {
  return <div className="text-4xl mb-2">🧾</div>;
}

function InvoiceRow({ inv, sym, onClick }: { inv: Invoice; sym: string; onClick: () => void }) {
  const { t } = useTranslation();
  const color = STATUS_COLORS[inv.status];
  return (
    <div className="px-5 py-3 flex items-center justify-between hover:bg-dark-2 cursor-pointer transition-colors" onClick={onClick}>
      <div>
        <p className="text-white text-sm font-medium">{inv.number}</p>
        <p className="text-dark-muted text-xs">{inv.dueDate}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white text-sm font-medium">{sym} {inv.total.toLocaleString()}</span>
        <span className="status-badge" style={{ background: `${color}20`, color }}>
          {t(`invoice.statuses.${inv.status}`)}
        </span>
      </div>
    </div>
  );
}
