
import { Home, Plus, Target, CreditCard, PieChart, Calendar, Settings, LogOut, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Adicionar Transação",
    url: "/transacao",
    icon: Plus,
  },
  {
    title: "Contas",
    url: "/contas",
    icon: CreditCard,
  },
  {
    title: "Metas",
    url: "/metas",
    icon: Target,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: PieChart,
  },
  {
    title: "Histórico Mensal",
    url: "/historico",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <Sidebar className="bg-gradient-to-b from-slate-950 to-green-950 border-r border-green-800/30">
      <SidebarHeader className="border-b border-green-800/30 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">PoupaIgão</h2>
            <p className="text-xs text-gray-400">Controle Financeiro</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 uppercase text-xs font-semibold mb-4">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full text-gray-300 hover:text-white hover:bg-green-800/30 transition-all duration-200 rounded-lg"
                  >
                    <button onClick={() => navigate(item.url)} className="flex items-center space-x-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-green-800/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-green-600 text-white text-sm">
                {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.display_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <SidebarMenuButton
              onClick={() => navigate('/perfil')}
              className="p-2 text-gray-400 hover:text-white hover:bg-green-800/30 rounded-lg"
            >
              <Settings className="w-4 h-4" />
            </SidebarMenuButton>
            <SidebarMenuButton
              onClick={signOut}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </SidebarMenuButton>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
