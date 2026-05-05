import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceNew from './pages/InvoiceNew';
import InvoiceDetail from './pages/InvoiceDetail';
import Clients from './pages/Clients';
import Settings from './pages/Settings';

function AppShell() {
  return (
    <AppLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="invoices/new" element={<InvoiceNew />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="invoices/:id/edit" element={<InvoiceNew />} />
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  );
}
