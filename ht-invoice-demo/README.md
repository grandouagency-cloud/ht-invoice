# ht-invoice · Demo 🇭🇹

> Live demo of [ht-invoice](https://github.com/grandouagency-cloud/ht-invoice) — deployed on GitHub Pages.

## 🔗 Live Demo

👉 **[grandouagency-cloud.github.io/ht-invoice](https://groudouagency-cloud.github.io/ht-invoice)**

## Features shown in demo

- Landing page (built for Lovable.dev or included here)
- Full invoice app with preloaded seed data
- Multi-currency: HTG · USD · EUR
- Trilingual: Français · English · Kreyòl
- No backend — 100% localStorage

## Deploy to GitHub Pages

```bash
npm install
npm run deploy
```

This runs `vite build` then `gh-pages -d dist`.

Make sure your repo name matches `base` in `vite.config.ts`:
```ts
base: '/ht-invoice/',  // ← change to your repo name
```

## Local dev

```bash
npm install
npm run dev
```

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Zustand · react-i18next · Recharts

---

← Back to [ht-invoice open source](https://github.com/grandouagency-cloud/ht-invoice)
