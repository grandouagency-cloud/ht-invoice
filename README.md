# ht-invoice 🇭🇹

> Open-source invoice tool for Haitian freelancers & small businesses — with multi-currency support (HTG, USD, EUR), trilingual UI (fr / en / ht), and PDF export.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

---

## ✨ Features

- 🧾 Create, edit, and manage invoices
- 📄 PDF export (Express + pdfkit backend)
- 📧 Send by email (Resend)
- 👥 Client management
- 💰 HTG · USD · EUR currencies
- 🔄 Invoice status flow: Draft → Sent → Paid / Overdue
- 🌍 Trilingual: Français · English · Kreyòl ayisyen
- 📊 Revenue dashboard with chart
- 💾 LocalStorage persistence (no database needed for demo)
- 🌙 Dark theme

---

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/ht-invoice.git
cd ht-invoice
npm install
cp .env.example .env
npm run dev
```

### With backend (PDF + email):

```bash
# Terminal 1
npm run dev

# Terminal 2 — requires pdfkit + resend
npm install pdfkit @types/pdfkit resend express cors dotenv
npm run server:dev
```

---

## 🔧 Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3001
VITE_DEMO_MODE=false          # true = localStorage only, no backend needed

# Backend
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=invoices@yourdomain.com
PORT=3001
```

Set `VITE_DEMO_MODE=true` to run without a backend — PDF and email show friendly demo messages.

---

## 📁 Structure

```
ht-invoice/
├── src/
│   ├── components/layout/   # Sidebar + mobile nav
│   ├── pages/               # Dashboard, Invoices, InvoiceNew, InvoiceDetail, Clients, Settings
│   ├── store/               # Zustand stores (invoices, clients, settings)
│   ├── types/               # TypeScript types + constants
│   └── i18n/locales/        # fr.json · en.json · ht.json
├── server/
│   ├── routes/pdf.ts        # POST /api/pdf/generate
│   └── routes/email.ts      # POST /api/email/send
└── public/demo-data.json    # Seed data for demo mode
```

---

## 🌍 Invoice Status Flow

```
DRAFT → SENT → PAID
         ↓
       OVERDUE  (if due date passed)
```

---

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

MIT © YOUR_NAME — Made with ❤️ in Haiti 🇭🇹
