
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  PieChart, 
  Plus,
  CreditCard,
  Banknote,
  AlertCircle
} from "lucide-react";
import { FinancialChart } from "@/components/FinancialChart";
import { ExpenseChart } from "@/components/ExpenseChart";
import { AccountCard } from "@/components/AccountCard";
import { QuickActions } from "@/components/QuickActions";
import { UpcomingBills } from "@/components/UpcomingBills";

const Index = () => {
  const totalBalance = 8450.32;
  const monthlyIncome = 4500.00;
  const monthlyExpenses = 3200.50;
  const monthlyBalance = monthlyIncome - monthlyExpenses;

  const accounts = [
    { name: "Conta Corrente", balance: 2450.32, type: "checking", color: "bg-blue-500" },
    { name: "Poupança", balance: 5200.00, type: "savings", color: "bg-green-500" },
    { name: "Investimentos", balance: 800.00, type: "investment", color: "bg-purple-500" }
  ];

  const goals = [
    { name: "Reserva de Emergência", current: 3500, target: 12000, priority: "high" },
    { name: "Viagem Europa", current: 1200, target: 8000, priority: "medium" },
    { name: "Novo Carro", current: 800, target: 25000, priority: "low" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PoupaIgão</h1>
                <p className="text-sm text-gray-500">Seu controle financeiro pessoal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-200">
                Olá, João! 👋
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center mt-2 text-green-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12.5% este mês</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Receitas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">Salário + extras</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Despesas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center mt-2 text-red-500">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm">71% do orçamento</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Saldo do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                R$ {monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center mt-2 ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {monthlyBalance >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span className="text-sm">{monthlyBalance >= 0 ? 'Superávit' : 'Déficit'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                Receitas vs Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialChart income={monthlyIncome} expenses={monthlyExpenses} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart />
            </CardContent>
          </Card>
        </div>

        {/* Accounts and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  Minhas Contas
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.map((account, index) => (
                <AccountCard key={index} account={account} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  Metas Financeiras
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Nova Meta
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{goal.name}</h4>
                    <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                      {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>R$ {goal.current.toLocaleString('pt-BR')}</span>
                      <span>R$ {goal.target.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((goal.current / goal.target) * 100)}% concluído
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />
          <UpcomingBills />
        </div>
      </main>
    </div>
  );
};

export default Index;
