
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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
  Receipt
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mainMenuItems = [
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

const profileMenuItems = [
  {
    title: 'Perfil',
    url: '/perfil',
    icon: User
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name;
    if (displayName) return displayName;
    
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
    <Sidebar className="[&>[data-sidebar=sidebar]]:bg-gradient-to-b [&>[data-sidebar=sidebar]]:from-green-900 [&>[data-sidebar=sidebar]]:via-green-800 [&>[data-sidebar=sidebar]]:to-green-900 border-r border-green-700/30">
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
        
        {/* User Info - Only Avatar and Name */}
        <div className="flex items-center space-x-3 mt-4 p-3 bg-green-800/30 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-green-600 text-white text-sm font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-white">{getUserDisplayName()}</p>
            <p className="text-xs text-green-200">{user?.email}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-green-200 font-semibold">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
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
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-green-200 font-semibold">Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileMenuItems.map((item) => {
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
          </SidebarGroupContent>
        </SidebarGroup>
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
