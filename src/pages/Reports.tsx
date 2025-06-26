
import React, { useState } from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, PieChart as PieChartIcon } from 'lucide-react';

const Reports = () => {
  const { 
    getMonthlyData, 
    getExpensesByCategory,
    getMonthlyIncome,
    getMonthlyExpenses,
    getMonthlyBalance,
    getTotalBalance,
    getTotalInvestments,
    getNetWorth,
    loading 
  } = useFinancialData();

  const [selectedPeriod, setSelectedPeriod] = useState('6');
  const monthlyData = getMonthlyData(parseInt(selectedPeriod));
  const currentExpensesByCategory = getExpensesByCategory();
  const currentIncome = getMonthlyIncome();
  const currentExpenses = getMonthlyExpenses();
  const currentBalance = getMonthlyBalance();

  // Dados para evolução do patrimônio
  const netWorthData = monthlyData.map(item => ({
    ...item,
    netWorth: getTotalBalance() + getTotalInvestments() // Simplificado para demonstração
  }));

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#EC4899', '#14B8A6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  const backgroundSvg = `data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("${backgroundSvg}")` }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-green-400" />
              Relatórios Financeiros
            </h1>
            <p className="text-gray-400 mt-2">Análise detalhada das suas finanças</p>
          </div>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="3" className="text-white">Últimos 3 meses</SelectItem>
              <SelectItem value="6" className="text-white">Últimos 6 meses</SelectItem>
              <SelectItem value="12" className="text-white">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs do Mês Atual */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Receitas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                R$ {currentIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Despesas do Mês</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                R$ {currentExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Saldo do Mês</CardTitle>
              <DollarSign className={`h-4 w-4 ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Patrimônio Líquido</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                R$ {getNetWorth().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Evolução do Fluxo de Caixa */}
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-400" />
                Fluxo de Caixa Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => [
                        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        name === 'income' ? 'Receitas' : name === 'expenses' ? 'Despesas' : 'Saldo'
                      ]}
                    />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Despesas por Categoria */}
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5 text-green-400" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {currentExpensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentExpensesByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {currentExpensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                          'Valor Gasto'
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma despesa no período</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolução do Patrimônio */}
        <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Evolução do Saldo Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                  <YAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Saldo'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Tendência de {monthlyData.length > 1 && monthlyData[monthlyData.length - 1].balance > monthlyData[0].balance ? 'crescimento' : 'declínio'} no período selecionado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
