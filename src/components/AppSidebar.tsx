
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  Home, 
  CreditCard, 
  Target, 
  TrendingUp, 
  Plus, 
  BarChart3,
  Calendar,
  User,
  Wallet,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home
  },
  {
    title: 'Nova Transação',
    url: '/transacao',
    icon: Plus
  },
  {
    title: 'Contas',
    url: '/contas',
    icon: CreditCard
  },
  {
    title: 'Metas',
    url: '/metas',
    icon: Target
  },
  {
    title: 'Investimentos',
    url: '/investimentos',
    icon: TrendingUp
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3
  },
  {
    title: 'Histórico Mensal',
    url: '/historico',
    icon: Calendar
  },
  {
    title: 'Perfil',
    url: '/perfil',
    icon: User
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar className="bg-gradient-to-b from-slate-950 via-green-950 to-slate-900 border-r border-green-800/30">
      <SidebarHeader className="border-b border-green-800/30 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">PoupaIgão</h2>
            <p className="text-xs text-gray-400">Controle Financeiro</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  className={`w-full justify-start transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-600/20 text-green-400 border-l-4 border-green-400 font-medium' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Link to={item.url} className="flex items-center space-x-3 px-4 py-3 rounded-r-lg">
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-green-800/30 p-4">
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-600/20"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
