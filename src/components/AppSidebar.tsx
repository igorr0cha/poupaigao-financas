
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
  LogOut,
  Receipt,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    title: 'Despesas',
    url: '/despesas',
    icon: Receipt
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
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    
    // Try to get display name from user metadata
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name;
    if (displayName) return displayName;
    
    // Fallback to email username
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Usuário';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Sidebar className="bg-gradient-to-b from-green-900 via-green-800 to-green-900 border-r border-green-700/30">
      <SidebarHeader className="border-b border-green-700/30 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">PoupaIgão</h2>
            <p className="text-xs text-green-200">Controle Financeiro</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex items-center justify-between mt-4 p-3 bg-green-800/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-green-600 text-white text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
              <p className="text-xs text-green-200">{user?.email}</p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-green-200 hover:text-white hover:bg-green-700/30 p-1"
          >
            <Link to="/perfil">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
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
                      ? 'bg-green-700/40 text-green-100 border-l-4 border-green-400 font-medium shadow-lg' 
                      : 'text-green-100 hover:text-white hover:bg-green-700/20'
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

      <SidebarFooter className="border-t border-green-700/30 p-4">
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-green-100 hover:text-white hover:bg-red-600/20"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
