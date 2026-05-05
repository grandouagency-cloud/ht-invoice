import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change '/ht-invoice/' to match your GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/ht-invoice/',
});
