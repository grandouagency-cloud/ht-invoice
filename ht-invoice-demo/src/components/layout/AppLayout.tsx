import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, Users, Settings, Globe, Home } from 'lucide-react';
import { useSettingsStore } from '../../store';

const LANGS = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'ht', flag: '🇭🇹', label: 'HT' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { updateSettings } = useSettingsStore();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/invoices',  icon: FileText,        label: t('nav.invoices')  },
    { to: '/clients',   icon: Users,           label: t('nav.clients')   },
    { to: '/settings',  icon: Settings,        label: t('nav.settings')  },
  ];

  const setLang = (code: string) => {
    i18n.changeLanguage(code);
    updateSettings({ language: code as any });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-dark-border bg-dark-card shrink-0">
        <div className="p-5 border-b border-dark-border flex items-center justify-between">
          <span className="font-display text-lg font-bold text-white">
            ht<span className="text-brand">-invoice</span>
          </span>
          <NavLink to="/" className="text-dark-muted hover:text-white transition-colors">
            <Home size={15} />
          </NavLink>
        </div>

        {/* Demo badge */}
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-brand/10 border border-brand/25 text-xs text-brand-light text-center">
          🎮 Demo Mode
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Lang switcher */}
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-1">
            <Globe size={11} className="text-dark-muted mr-1" />
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  i18n.language === l.code ? 'bg-brand text-white' : 'text-dark-muted hover:text-white'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top demo banner */}
        <div className="bg-brand/10 border-b border-brand/20 px-4 py-2 text-xs text-brand-light text-center flex items-center justify-center gap-3">
          <span>{t('demo')}</span>
          <NavLink to="/" className="underline hover:text-white transition-colors">← {t('nav.landing')}</NavLink>
        </div>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex border-t border-dark-border bg-dark-card">
          <NavLink to="/" className="flex-1 flex flex-col items-center py-3 text-xs gap-1 text-dark-muted hover:text-brand transition-colors">
            <Home size={18} />
            <span>Home</span>
          </NavLink>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${isActive ? 'text-brand' : 'text-dark-muted'}`
              }
            >
              <Icon size={18} />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
