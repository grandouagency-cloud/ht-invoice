import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText, Users, Globe, Download, Mail, TrendingUp,
  Github, ArrowRight, CheckCircle, Zap, Star
} from 'lucide-react';

const FEATURES = [
  { icon: TrendingUp, key: 'f1', color: '#8248DE' },
  { icon: Globe,      key: 'f2', color: '#3B82F6' },
  { icon: Download,   key: 'f3', color: '#22C55E' },
  { icon: Mail,       key: 'f4', color: '#F59E0B' },
  { icon: Users,      key: 'f5', color: '#EC4899' },
  { icon: FileText,   key: 'f6', color: '#14B8A6' },
];

const STATS = [
  { value: 'HTG · USD · EUR', label: 'Currencies' },
  { value: 'fr · en · ht', label: 'Languages' },
  { value: 'MIT', label: 'License' },
  { value: '100%', label: 'Free' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const LANGS = [
    { code: 'fr', flag: '🇫🇷', label: 'FR' },
    { code: 'en', flag: '🇺🇸', label: 'EN' },
    { code: 'ht', flag: '🇭🇹', label: 'HT' },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-dark-border/50 bg-dark-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-white">
            ht<span className="text-brand">-invoice</span>
            <span className="ml-2 text-xs">🇭🇹</span>
          </span>
          <div className="flex items-center gap-3">
            {/* Lang switcher */}
            <div className="flex gap-1">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => i18n.changeLanguage(l.code)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    i18n.language === l.code
                      ? 'bg-brand text-white'
                      : 'text-dark-muted hover:text-white'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
            <a
              href="https://github.com/YOUR_USERNAME/ht-invoice"
              target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-dark-muted hover:text-white transition-colors text-sm"
            >
              <Github size={15} /> GitHub
            </a>
            <button className="btn-primary py-1.5 px-4 text-sm" onClick={() => navigate('/dashboard')}>
              {t('landing.cta')} <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero-gradient grid-pattern flex flex-col items-center justify-center text-center px-6 pt-40 pb-28 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="animate-in relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 text-brand-light rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star size={12} fill="currentColor" /> {t('landing.badge')}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-2">
            {t('landing.headline1')}
          </h1>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-brand">{t('landing.headline2')}</span>
          </h1>

          <p className="text-dark-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {t('landing.sub')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              className="btn-primary pulse-glow flex items-center gap-2 text-base px-7 py-3"
              onClick={() => navigate('/dashboard')}
            >
              <Zap size={18} /> {t('landing.cta')}
            </button>
            <a
              href="https://github.com/YOUR_USERNAME/ht-invoice"
              target="_blank" rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-2 text-base px-7 py-3"
            >
              <Github size={18} /> {t('landing.github')}
            </a>
          </div>
          <p className="text-dark-muted text-xs mt-4">{t('landing.ctaSub')}</p>
        </div>

        {/* Floating invoice card preview */}
        <div className="animate-float relative z-10 mt-16 max-w-sm w-full mx-auto">
          <div className="card p-5 text-left shadow-2xl shadow-brand/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-dark-muted text-xs uppercase tracking-wider">Invoice</p>
                <p className="text-white font-bold font-display">INV-2025-001</p>
              </div>
              <span className="status-badge bg-green-500/20 text-green-400">✓ Paid</span>
            </div>
            <p className="text-dark-muted text-xs mb-1">Marie Desrosiers · Tech Haiti SARL</p>
            <div className="border-t border-dark-border mt-3 pt-3 flex justify-between">
              <span className="text-dark-muted text-sm">Total</span>
              <span className="text-brand font-bold text-lg">$ 1,980.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-dark-border bg-dark-card/40 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <p className="font-display text-xl sm:text-2xl font-bold text-brand">{s.value}</p>
              <p className="text-dark-muted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-display text-3xl font-bold text-white">Everything you need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, key, color }) => (
              <div key={key} className="card p-6 glow-border hover:bg-dark-2 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{t(`landing.${key}title`)}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{t(`landing.${key}desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open source CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-brand/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center mx-auto mb-5">
                <Github size={26} className="text-brand" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">{t('landing.openTitle')}</h2>
              <p className="text-dark-muted mb-8 max-w-md mx-auto leading-relaxed">{t('landing.openDesc')}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/dashboard')}>
                  <Zap size={16} /> {t('landing.cta')}
                </button>
                <a
                  href="https://github.com/YOUR_USERNAME/ht-invoice"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-ghost flex items-center gap-2"
                >
                  <Github size={16} /> {t('landing.github')}
                </a>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-dark-muted">
                {['No signup', 'No database', 'MIT License'].map(item => (
                  <span key={item} className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-400" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-dark-border py-8 px-6 text-center">
        <p className="text-dark-muted text-sm">
          <span className="font-display text-white">ht<span className="text-brand">-invoice</span></span>
          {' · '}{t('landing.footerBy')}
          {' · '}
          <a href="https://github.com/YOUR_USERNAME/ht-invoice" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-light transition-colors">
            GitHub
          </a>
        </p>
      </footer>

    </div>
  );
}
