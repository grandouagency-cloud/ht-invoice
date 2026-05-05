import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store';
import { Currency, Language } from '../types';
import { Check } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...settings });

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateSettings(form);
    i18n.changeLanguage(form.language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in max-w-xl">
      <h1 className="font-display text-2xl font-bold text-white">{t('settings.title')}</h1>

      {/* Business profile */}
      <div className="card p-5 space-y-4">
        <p className="text-white font-medium border-b border-dark-border pb-3">{t('settings.business')}</p>
        {[
          { key: 'businessName', label: t('settings.businessName') },
          { key: 'businessEmail', label: t('settings.businessEmail'), type: 'email' },
          { key: 'businessPhone', label: t('settings.businessPhone') },
          { key: 'businessAddress', label: t('settings.businessAddress') },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input
              className="input"
              type={type ?? 'text'}
              value={(form as any)[key] ?? ''}
              onChange={e => set(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Defaults */}
      <div className="card p-5 space-y-4">
        <p className="text-white font-medium border-b border-dark-border pb-3">{t('settings.defaults')}</p>
        <div>
          <label className="label">{t('settings.defaultCurrency')}</label>
          <select className="input" value={form.defaultCurrency} onChange={e => set('defaultCurrency', e.target.value as Currency)}>
            <option value="HTG">🇭🇹 HTG — Gourde haïtienne</option>
            <option value="USD">🇺🇸 USD — US Dollar</option>
            <option value="EUR">🇪🇺 EUR — Euro</option>
          </select>
        </div>
        <div>
          <label className="label">{t('settings.defaultTax')}</label>
          <input type="number" min="0" max="100" className="input" value={form.defaultTaxRate} onChange={e => set('defaultTaxRate', Number(e.target.value))} />
        </div>
        <div>
          <label className="label">{t('settings.language')}</label>
          <select className="input" value={form.language} onChange={e => set('language', e.target.value as Language)}>
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇺🇸 English</option>
            <option value="ht">🇭🇹 Kreyòl ayisyen</option>
          </select>
        </div>
      </div>

      <button className="btn-primary flex items-center gap-2 pulse-glow" onClick={handleSave}>
        {saved ? <><Check size={16} /> Saved!</> : t('actions.save')}
      </button>
    </div>
  );
}
