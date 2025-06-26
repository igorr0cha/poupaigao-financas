
import React from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target, PiggyBank } from 'lucide-react';
import { FinancialChart } from '@/components/FinancialChart';
import { ExpenseChart } from '@/components/ExpenseChart';
import UpcomingBillsAdvanced from '@/components/UpcomingBillsAdvanced';
import QuickActionsAdvanced from '@/components/QuickActionsAdvanced';
import { AnimatedCounter } from '@/components/AnimatedCounter';

const Index = () => {
  const { user } = useAuth();
  const { 
    getTotalBalance, 
    getTotalInvestments,
    getNetWorth,
    getMonthlyIncome, 
    getMonthlyExpenses, 
    getMonthlyBalance,
    getExpensesByCategory,
    goals,
    loading 
  } = useFinancialData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  const totalBalance = getTotalBalance();
  const totalInvestments = getTotalInvestments();
  const netWorth = getNetWorth();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const monthlyBalance = getMonthlyBalance();
  const expensesByCategory = getExpensesByCategory();

  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name;
    if (displayName) return displayName.split(' ')[0];
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Usuário';
  };

  const backgroundSvg = `data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  const getGoalProgress = () => {
    const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
    const totalGoalCurrent = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
    const progress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) * 100 : 0;
    return { progress, current: totalGoalCurrent, target: totalGoalTarget };
  };

  const goalProgress = getGoalProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("${backgroundSvg}")` }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with personalized greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {getUserDisplayName()} | Dashboard Financeiro
          </h1>
          <p className="text-gray-400">Acompanhe suas finanças em tempo real</p>
        </div>

        {/* KPIs - Main Financial Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 hover:bg-black/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Patrimônio Líquido</CardTitle>
              <PiggyBank className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ <AnimatedCounter value={netWorth} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Contas + Investimentos
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 hover:bg-black/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Receitas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                R$ <AnimatedCounter value={monthlyIncome} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 hover:bg-black/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Despesas do Mês</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                R$ <AnimatedCounter value={monthlyExpenses} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 hover:bg-black/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Saldo do Mês</CardTitle>
              <DollarSign className={`h-4 w-4 ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ <AnimatedCounter value={monthlyBalance} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Receitas - Despesas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Information - Cards that require user attention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UpcomingBillsAdvanced />
          
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-400" />
                Progresso das Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Total das Metas</span>
                    <span className="text-white font-medium">
                      {goalProgress.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(goalProgress.progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>R$ {goalProgress.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>R$ {goalProgress.target.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                
                {goals.slice(0, 3).map((goal) => {
                  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{goal.name}</span>
                        <span className="text-sm text-white">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            goal.priority === 'high' ? 'bg-red-500' :
                            goal.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <QuickActionsAdvanced />
          
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  R$ <AnimatedCounter value={totalInvestments} />
                </div>
                <p className="text-gray-400">Valor total dos seus investimentos</p>
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                  <p className="text-sm text-blue-300">
                    {((totalInvestments / (totalBalance || 1)) * 100).toFixed(1)}% do seu patrimônio
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Receitas vs Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialChart income={monthlyIncome} expenses={monthlyExpenses} />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart data={expensesByCategory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
