import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, Users, Settings, Globe } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const LANGS = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ht', label: 'HT', flag: '🇭🇹' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/invoices', icon: FileText, label: t('nav.invoices') },
    { to: '/clients', icon: Users, label: t('nav.clients') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const setLang = (code: string) => {
    i18n.changeLanguage(code);
    updateSettings({ language: code as any });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-dark-border bg-dark-card shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-dark-border">
          <span className="font-display text-xl font-bold text-white tracking-wider">
            ht<span className="text-brand">-invoice</span>
          </span>
          <span className="ml-2 text-xs text-dark-muted">🇭🇹</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Lang switcher */}
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-1">
            <Globe size={12} className="text-dark-muted mr-1" />
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  settings.language === l.code
                    ? 'bg-brand text-white'
                    : 'text-dark-muted hover:text-white'
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
        {/* Demo banner */}
        {DEMO_MODE && (
          <div className="bg-brand/10 border-b border-brand/30 px-4 py-2 text-xs text-brand-light text-center">
            {t('demo')}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex border-t border-dark-border bg-dark-card">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
                  isActive ? 'text-brand' : 'text-dark-muted'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
