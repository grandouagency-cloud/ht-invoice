import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const en = {
  nav: { dashboard: 'Dashboard', invoices: 'Invoices', clients: 'Clients', settings: 'Settings', landing: 'Home' },
  invoice: { new: 'New Invoice', edit: 'Edit Invoice', number: 'Invoice #', client: 'Client', issueDate: 'Issue Date', dueDate: 'Due Date', currency: 'Currency', status: 'Status', lineItems: 'Line Items', description: 'Description', qty: 'Qty', unitPrice: 'Unit Price', amount: 'Amount', subtotal: 'Subtotal', tax: 'Tax', total: 'Total', notes: 'Notes', addLine: '+ Add Line', download: 'Download PDF', sendEmail: 'Send Email', markPaid: 'Mark Paid', markSent: 'Mark Sent', statuses: { draft: 'Draft', sent: 'Sent', paid: 'Paid', overdue: 'Overdue' } },
  client: { new: 'New Client', name: 'Full Name', email: 'Email', phone: 'Phone', company: 'Company', address: 'Address', invoiceCount: 'invoices' },
  settings: { title: 'Settings', business: 'Business Profile', businessName: 'Business Name', businessEmail: 'Email', businessPhone: 'Phone', businessAddress: 'Address', defaults: 'Defaults', defaultCurrency: 'Default Currency', defaultTax: 'Default Tax Rate (%)', language: 'Language' },
  actions: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', view: 'View', confirm: 'Are you sure?' },
  dashboard: { title: 'Dashboard', revenue: 'Total Revenue', paid: 'Paid', pending: 'Pending', overdue: 'Overdue', recentInvoices: 'Recent Invoices', revenueChart: 'Revenue – last 6 months' },
  demo: 'Demo Mode — data stored locally · no account needed',
  empty: { invoices: 'No invoices yet. Create your first one!', clients: 'No clients yet. Add your first client!' },
  landing: {
    badge: 'Open Source · Free · Made in Haiti 🇭🇹',
    headline1: 'Invoice tool for', headline2: 'Haitian freelancers',
    sub: 'Create, send, and track invoices in HTG, USD or EUR — in French, English or Haitian Creole.',
    cta: 'Try the Demo', ctaSub: 'No account needed', github: 'View on GitHub',
    f1title: 'Multi-currency', f1desc: 'HTG · USD · EUR with correct symbols everywhere.',
    f2title: 'Trilingual', f2desc: 'Français · English · Kreyòl ayisyen — switch instantly.',
    f3title: 'PDF Export', f3desc: 'Generate professional PDF invoices in one click.',
    f4title: 'Email Invoices', f4desc: 'Send invoices directly to clients via email.',
    f5title: 'Client Manager', f5desc: 'Manage all your clients and their invoice history.',
    f6title: 'Status Tracking', f6desc: 'Draft → Sent → Paid · Overdue alerts.',
    openTitle: '100% Open Source', openDesc: 'MIT license. Self-host, fork, contribute. Your data stays yours.',
    footerBy: 'Built with ❤️ in Haiti',
  }
};

const fr = {
  nav: { dashboard: 'Tableau de bord', invoices: 'Factures', clients: 'Clients', settings: 'Paramètres', landing: 'Accueil' },
  invoice: { new: 'Nouvelle facture', edit: 'Modifier', number: 'Facture #', client: 'Client', issueDate: "Date d'émission", dueDate: "Date d'échéance", currency: 'Devise', status: 'Statut', lineItems: 'Articles', description: 'Description', qty: 'Qté', unitPrice: 'Prix unitaire', amount: 'Montant', subtotal: 'Sous-total', tax: 'Taxe', total: 'Total', notes: 'Notes', addLine: '+ Ajouter', download: 'Télécharger PDF', sendEmail: 'Envoyer par email', markPaid: 'Marquer payée', markSent: 'Marquer envoyée', statuses: { draft: 'Brouillon', sent: 'Envoyée', paid: 'Payée', overdue: 'En retard' } },
  client: { new: 'Nouveau client', name: 'Nom complet', email: 'Email', phone: 'Téléphone', company: 'Entreprise', address: 'Adresse', invoiceCount: 'factures' },
  settings: { title: 'Paramètres', business: 'Profil entreprise', businessName: "Nom de l'entreprise", businessEmail: 'Email', businessPhone: 'Téléphone', businessAddress: 'Adresse', defaults: 'Valeurs par défaut', defaultCurrency: 'Devise par défaut', defaultTax: 'Taux de taxe (%)', language: 'Langue' },
  actions: { save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier', view: 'Voir', confirm: 'Êtes-vous sûr ?' },
  dashboard: { title: 'Tableau de bord', revenue: 'Revenus totaux', paid: 'Payées', pending: 'En attente', overdue: 'En retard', recentInvoices: 'Factures récentes', revenueChart: 'Revenus – 6 derniers mois' },
  demo: 'Mode démo — données locales · aucun compte requis',
  empty: { invoices: 'Aucune facture. Créez votre première !', clients: 'Aucun client. Ajoutez le premier !' },
  landing: {
    badge: 'Open Source · Gratuit · Fait en Haïti 🇭🇹',
    headline1: 'Outil de facturation pour', headline2: 'freelances haïtiens',
    sub: 'Créez, envoyez et suivez vos factures en HTG, USD ou EUR — en français, anglais ou créole haïtien.',
    cta: 'Essayer la démo', ctaSub: 'Aucun compte requis', github: 'Voir sur GitHub',
    f1title: 'Multi-devises', f1desc: 'HTG · USD · EUR avec les bons symboles partout.',
    f2title: 'Trilingue', f2desc: 'Français · English · Kreyòl — changez instantanément.',
    f3title: 'Export PDF', f3desc: 'Générez des factures PDF professionnelles en un clic.',
    f4title: 'Envoi par email', f4desc: 'Envoyez vos factures directement aux clients.',
    f5title: 'Gestion clients', f5desc: "Gérez tous vos clients et l'historique de leurs factures.",
    f6title: 'Suivi des statuts', f6desc: 'Brouillon → Envoyée → Payée · Alertes de retard.',
    openTitle: '100% Open Source', openDesc: 'Licence MIT. Auto-hébergez, forkez, contribuez. Vos données restent chez vous.',
    footerBy: 'Fait avec ❤️ en Haïti',
  }
};

const ht = {
  nav: { dashboard: 'Tablo de bò', invoices: 'Fakti', clients: 'Kliyan', settings: 'Paramèt', landing: 'Akèy' },
  invoice: { new: 'Nouvo fakti', edit: 'Modifye', number: 'Fakti #', client: 'Kliyan', issueDate: 'Dat emisyon', dueDate: 'Dat echèans', currency: 'Devis', status: 'Estati', lineItems: 'Atik', description: 'Deskripsyon', qty: 'Qte', unitPrice: 'Pri inite', amount: 'Montan', subtotal: 'Sou-total', tax: 'Taks', total: 'Total', notes: 'Nòt', addLine: '+ Ajoute', download: 'Telechaje PDF', sendEmail: 'Voye pa email', markPaid: 'Make peye', markSent: 'Make voye', statuses: { draft: 'Bouyon', sent: 'Voye', paid: 'Peye', overdue: 'An reta' } },
  client: { new: 'Nouvo kliyan', name: 'Non konplè', email: 'Email', phone: 'Telefòn', company: 'Antrepriz', address: 'Adrès', invoiceCount: 'fakti' },
  settings: { title: 'Paramèt', business: 'Pwofil biznis', businessName: 'Non biznis', businessEmail: 'Email', businessPhone: 'Telefòn', businessAddress: 'Adrès', defaults: 'Valè pa defò', defaultCurrency: 'Devis pa defò', defaultTax: 'Taks (%)', language: 'Lang' },
  actions: { save: 'Anrejistre', cancel: 'Anile', delete: 'Efase', edit: 'Modifye', view: 'Wè', confirm: 'Ou sèten ?' },
  dashboard: { title: 'Tablo de bò', revenue: 'Revni total', paid: 'Peye', pending: 'Annatant', overdue: 'An reta', recentInvoices: 'Dènye fakti', revenueChart: 'Revni – 6 dènye mwa' },
  demo: 'Mòd demo — done lokal · pa bezwen kont',
  empty: { invoices: 'Pa gen fakti. Kreye premye ou a !', clients: 'Pa gen kliyan. Ajoute premye ou !' },
  landing: {
    badge: 'Open Source · Gratis · Fèt ann Ayiti 🇭🇹',
    headline1: 'Zouti fakti pou', headline2: 'frilansè ayisyen',
    sub: 'Kreye, voye, swiv fakti ou yo an HTG, USD oswa EUR — an fransè, anglè oswa kreyòl.',
    cta: 'Eseye Demo a', ctaSub: 'Pa bezwen kont', github: 'Wè sou GitHub',
    f1title: 'Plizye devis', f1desc: 'HTG · USD · EUR avèk bon senbòl yo.',
    f2title: '3 lang', f2desc: 'Français · English · Kreyòl — chanje imedyatman.',
    f3title: 'Ekspòte PDF', f3desc: 'Jenere fakti PDF pwofesyonèl an yon klik.',
    f4title: 'Voye pa email', f4desc: 'Voye fakti ou yo dirèkteman bay kliyan yo.',
    f5title: 'Jesyon kliyan', f5desc: 'Jere tout kliyan ou yo ak istwa fakti yo.',
    f6title: 'Swiv estati', f6desc: 'Bouyon → Voye → Peye · Alèt an reta.',
    openTitle: '100% Open Source', openDesc: 'Lisans MIT. Enstale kote ou vle, fòke, kontribye. Done ou yo rete pa ou.',
    footerBy: 'Fèt avèk ❤️ ann Ayiti',
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fr: { translation: fr }, ht: { translation: ht } },
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
  });

export default i18n;
