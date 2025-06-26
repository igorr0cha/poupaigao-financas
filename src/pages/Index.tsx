
import React from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedFinancialChart } from '@/components/EnhancedFinancialChart';
import UpcomingBills from '@/components/UpcomingBills';
import QuickActions from '@/components/QuickActions';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Index = () => {
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
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          <p className="text-green-400 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const totalBalance = getTotalBalance();
  const totalInvestments = getTotalInvestments();
  const netWorth = getNetWorth();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const monthlyBalance = getMonthlyBalance();

  const backgroundSvg = `data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("${backgroundSvg}")` }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Financeiro</h1>
          <p className="text-gray-400">Bem-vindo ao seu controle financeiro pessoal</p>
        </div>

        {/* KPIs Principais - Linha Superior */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Patrimônio Líquido</CardTitle>
              <Wallet className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Contas + Investimentos
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Receitas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {monthlyIncome > 0 ? '+' : ''}
                {((monthlyIncome / (monthlyIncome + monthlyExpenses)) * 100 || 0).toFixed(1)}% do fluxo
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Despesas do Mês</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {((monthlyExpenses / (monthlyIncome + monthlyExpenses)) * 100 || 0).toFixed(1)}% do fluxo
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Saldo do Mês</CardTitle>
              <DollarSign className={`h-4 w-4 ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ {monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {monthlyBalance >= 0 ? 'Sobra mensal' : 'Déficit mensal'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Insights e Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <UpcomingBills />
          </div>
          <QuickActions />
        </div>

        {/* Cards de Investimentos e Metas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">
                R$ {totalInvestments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-gray-400 text-sm">
                {((totalInvestments / netWorth) * 100 || 0).toFixed(1)}% do patrimônio líquido
              </p>
              <div className="mt-4">
                <Progress 
                  value={(totalInvestments / netWorth) * 100 || 0} 
                  className="h-2 bg-gray-800"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-400" />
                Progresso das Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.slice(0, 2).map((goal) => {
                    const progress = (goal.current_amount / goal.target_amount) * 100;
                    return (
                      <div key={goal.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{goal.name}</span>
                          <span className="text-gray-400">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-800" />
                        <p className="text-xs text-gray-500 mt-1">
                          R$ {goal.current_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {goal.target_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma meta definida</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-green-400" />
                Receitas vs Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedFinancialChart
                income={monthlyIncome}
                expenses={monthlyExpenses}
                showComparison={false}
              />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-green-400" />
                Comparativo Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedFinancialChart
                income={monthlyIncome}
                expenses={monthlyExpenses}
                showComparison={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
