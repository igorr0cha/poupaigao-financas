
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, CreditCard, Target, DollarSign, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '@/hooks/useFinancialData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const QuickActionsAdvanced = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accounts, goals, refetch } = useFinancialData();
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [reserveData, setReserveData] = useState({
    goalId: '',
    amount: '',
    accountId: ''
  });
  const [balanceData, setBalanceData] = useState({
    accountId: '',
    newBalance: ''
  });
  const [saving, setSaving] = useState(false);

  const actions = [
    {
      title: 'Nova Transação',
      description: 'Registre receitas e despesas',
      icon: Plus,
      onClick: () => navigate('/transacao'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Investimentos',
      description: 'Gerencie seu portfólio',
      icon: TrendingUp,
      onClick: () => navigate('/investimentos'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Contas',
      description: 'Administre suas contas',
      icon: CreditCard,
      onClick: () => navigate('/contas'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Metas',
      description: 'Acompanhe seus objetivos',
      icon: Target,
      onClick: () => navigate('/metas'),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleReserveMoney = async () => {
    if (!user || !reserveData.goalId || !reserveData.amount || !reserveData.accountId) return;
    
    setSaving(true);
    try {
      const amount = parseFloat(reserveData.amount);
      const account = accounts.find(a => a.id === reserveData.accountId);
      const goal = goals.find(g => g.id === reserveData.goalId);
      
      if (!account || !goal) throw new Error('Conta ou meta não encontrada');
      if (account.balance < amount) throw new Error('Saldo insuficiente');

      // Atualizar saldo da conta
      const { error: accountError } = await supabase
        .from('accounts')
        .update({ balance: account.balance - amount })
        .eq('id', reserveData.accountId);

      if (accountError) throw accountError;

      // Atualizar valor atual da meta
      const { error: goalError } = await supabase
        .from('financial_goals')
        .update({ current_amount: goal.current_amount + amount })
        .eq('id', reserveData.goalId);

      if (goalError) throw goalError;

      // Criar transação de registro
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'expense',
          amount: amount,
          description: `Reserva para meta: ${goal.name}`,
          account_id: reserveData.accountId,
          date: new Date().toISOString().split('T')[0],
          competence_month: new Date().getMonth() + 1,
          competence_year: new Date().getFullYear()
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Dinheiro reservado!",
        description: `R$ ${amount.toFixed(2)} reservado para ${goal.name}`,
      });

      setReserveData({ goalId: '', amount: '', accountId: '' });
      setReserveDialogOpen(false);
      await refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao reservar dinheiro.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!user || !balanceData.accountId || !balanceData.newBalance) return;
    
    setSaving(true);
    try {
      const newBalance = parseFloat(balanceData.newBalance);
      const account = accounts.find(a => a.id === balanceData.accountId);
      
      if (!account) throw new Error('Conta não encontrada');

      // Registrar ajuste no histórico
      const { error: adjustmentError } = await supabase
        .from('account_balance_adjustments')
        .insert({
          user_id: user.id,
          account_id: balanceData.accountId,
          old_balance: account.balance,
          new_balance: newBalance,
          reason: 'Ajuste manual de saldo'
        });

      if (adjustmentError) throw adjustmentError;

      // Atualizar saldo da conta
      const { error: accountError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', balanceData.accountId);

      if (accountError) throw accountError;

      toast({
        title: "Saldo ajustado!",
        description: `Saldo da conta ${account.name} ajustado para R$ ${newBalance.toFixed(2)}`,
      });

      setBalanceData({ accountId: '', newBalance: '' });
      setBalanceDialogOpen(false);
      await refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao ajustar saldo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
      <CardHeader>
        <CardTitle className="text-white">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                onClick={action.onClick}
                className={`h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r ${action.color} hover:opacity-90 transition-all duration-200 transform hover:scale-105`}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Reservar Dinheiro */}
          <Dialog open={reserveDialogOpen} onOpenChange={setReserveDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:opacity-90">
                <DollarSign className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium text-sm">Reservar Dinheiro</p>
                  <p className="text-xs opacity-90">Para suas metas</p>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Reservar Dinheiro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal" className="text-gray-300">Meta</Label>
                  <Select value={reserveData.goalId} onValueChange={(value) => setReserveData({...reserveData, goalId: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione a meta" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id} className="text-white">
                          {goal.name} - R$ {goal.current_amount.toFixed(2)} / R$ {goal.target_amount.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount" className="text-gray-300">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={reserveData.amount}
                    onChange={(e) => setReserveData({...reserveData, amount: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="account" className="text-gray-300">Conta de Origem</Label>
                  <Select value={reserveData.accountId} onValueChange={(value) => setReserveData({...reserveData, accountId: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id} className="text-white">
                          {account.name} - R$ {account.balance.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleReserveMoney} 
                  disabled={saving}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {saving ? 'Processando...' : 'Reservar Dinheiro'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Ajustar Saldo */}
          <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:opacity-90">
                <Settings className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium text-sm">Ajustar Saldo</p>
                  <p className="text-xs opacity-90">De suas contas</p>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Ajustar Saldo da Conta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="balance-account" className="text-gray-300">Conta</Label>
                  <Select value={balanceData.accountId} onValueChange={(value) => setBalanceData({...balanceData, accountId: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id} className="text-white">
                          {account.name} - R$ {account.balance.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-balance" className="text-gray-300">Novo Saldo</Label>
                  <Input
                    id="new-balance"
                    type="number"
                    step="0.01"
                    value={balanceData.newBalance}
                    onChange={(e) => setBalanceData({...balanceData, newBalance: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="0.00"
                  />
                </div>
                <Button 
                  onClick={handleAdjustBalance} 
                  disabled={saving}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? 'Processando...' : 'Ajustar Saldo'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsAdvanced;
