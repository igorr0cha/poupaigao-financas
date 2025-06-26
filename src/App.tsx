
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Accounts from '@/pages/Accounts';
import Goals from '@/pages/Goals';
import Investments from '@/pages/Investments';
import Transactions from '@/pages/Transactions';
import Reports from '@/pages/Reports';
import MonthlyHistory from '@/pages/MonthlyHistory';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/perfil" element={<Profile />} />
                      <Route path="/contas" element={<Accounts />} />
                      <Route path="/metas" element={<Goals />} />
                      <Route path="/investimentos" element={<Investments />} />
                      <Route path="/transacao" element={<Transactions />} />
                      <Route path="/despesas" element={<Expenses />} />
                      <Route path="/relatorios" element={<Reports />} />
                      <Route path="/historico" element={<MonthlyHistory />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
