import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  PieChart, 
  Plus,
  CreditCard,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { FinancialChart } from '@/components/FinancialChart';
import { ExpenseChart } from '@/components/ExpenseChart';
import { AccountCard } from '@/components/AccountCard';
import { QuickActions } from '@/components/QuickActions';
import { UpcomingBills } from '@/components/UpcomingBills';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const {
    accounts,
    goals,
    loading: dataLoading,
    getTotalBalance,
    getMonthlyIncome,
    getMonthlyExpenses,
    getExpensesByCategory
  } = useFinancialData();

  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          <p className="text-green-400 font-medium">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalBalance = getTotalBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const expensesByCategory = getExpensesByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url("${backgroundPattern}")` }}
      ></div>
      
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-green-800/30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  PoupaIgão
                </h1>
                <p className="text-sm text-gray-400">Controle financeiro premium</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
                Olá, {profile?.display_name || user.email?.split('@')[0]} 👋
              </Badge>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/perfil')}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      {profile?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-red-400 hover:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
              
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500/90 to-emerald-600/90 text-white backdrop-blur-sm border-green-400/30 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R$ <AnimatedCounter value={totalBalance} />
              </div>
              <div className="flex items-center mt-2 text-green-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">Patrimônio atual</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Receitas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                R$ <AnimatedCounter value={monthlyIncome} />
              </div>
              <div className="flex items-center mt-2 text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">Entradas</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Despesas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                R$ <AnimatedCounter value={monthlyExpenses} />
              </div>
              <div className="flex items-center mt-2 text-red-400">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm">Saídas</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Saldo do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ <AnimatedCounter value={Math.abs(monthlyBalance)} />
              </div>
              <div className={`flex items-center mt-2 ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {monthlyBalance >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span className="text-sm">{monthlyBalance >= 0 ? 'Superávit' : 'Déficit'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <PieChart className="w-5 h-5 mr-2 text-green-400" />
                Receitas vs Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialChart income={monthlyIncome} expenses={monthlyExpenses} />
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart data={expensesByCategory} />
            </CardContent>
          </Card>
        </div>

        {/* Accounts and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                  Minhas Contas
                </div>
                <Button variant="outline" size="sm" className="border-green-400/30 text-green-400 hover:bg-green-400 hover:text-black">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conta cadastrada</p>
                  <p className="text-sm">Adicione suas contas para começar</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Metas Financeiras
                </div>
                <Button variant="outline" size="sm" className="border-green-400/30 text-green-400 hover:bg-green-400 hover:text-black">
                  <Plus className="w-4 h-4 mr-1" />
                  Nova Meta
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-gray-900/50 rounded-lg border border-green-800/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">{goal.name}</h4>
                      <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                        {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>R$ {Number(goal.current_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span>R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((Number(goal.current_amount) / Number(goal.target_amount)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100)}% concluído
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma meta cadastrada</p>
                  <p className="text-sm">Defina seus objetivos financeiros</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl rounded-lg">
            <QuickActions />
          </div>
          <div className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl rounded-lg">
            <UpcomingBills />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
