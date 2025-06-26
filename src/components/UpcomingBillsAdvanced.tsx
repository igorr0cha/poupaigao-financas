
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, AlertTriangle, CheckCircle, Check } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { differenceInDays, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const UpcomingBillsAdvanced = () => {
  const { user } = useAuth();
  const { upcomingBills, accounts, refetch } = useFinancialData();
  const [paymentDialog, setPaymentDialog] = useState<{open: boolean, bill: any}>({open: false, bill: null});
  const [selectedAccount, setSelectedAccount] = useState('');
  const [processing, setProcessing] = useState(false);

  const sortedBills = upcomingBills
    .filter(bill => !bill.is_paid)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const getBadgeVariant = (dueDate: string) => {
    const days = differenceInDays(parseISO(dueDate), new Date());
    if (days < 0) return 'destructive';
    if (days <= 3) return 'destructive';
    if (days <= 7) return 'secondary';
    return 'default';
  };

  const getBadgeText = (dueDate: string) => {
    const days = differenceInDays(parseISO(dueDate), new Date());
    if (days < 0) return `${Math.abs(days)} dias em atraso`;
    if (days === 0) return 'Vence hoje';
    if (days === 1) return 'Vence amanhã';
    return `${days} dias`;
  };

  const handleMarkAsPaid = async () => {
    if (!user || !paymentDialog.bill || !selectedAccount) return;
    
    setProcessing(true);
    try {
      const account = accounts.find(a => a.id === selectedAccount);
      if (!account) throw new Error('Conta não encontrada');
      if (account.balance < paymentDialog.bill.amount) throw new Error('Saldo insuficiente');

      // Marcar conta como paga
      const { error: billError } = await supabase
        .from('upcoming_bills')
        .update({ is_paid: true })
        .eq('id', paymentDialog.bill.id);

      if (billError) throw billError;

      // Debitar da conta
      const { error: accountError } = await supabase
        .from('accounts')
        .update({ balance: account.balance - paymentDialog.bill.amount })
        .eq('id', selectedAccount);

      if (accountError) throw accountError;

      // Criar transação
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'expense',
          amount: paymentDialog.bill.amount,
          description: `Pagamento: ${paymentDialog.bill.name}`,
          account_id: selectedAccount,
          category_id: paymentDialog.bill.category_id,
          date: new Date().toISOString().split('T')[0],
          due_date: paymentDialog.bill.due_date,
          competence_month: new Date().getMonth() + 1,
          competence_year: new Date().getFullYear(),
          is_paid: true
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Conta paga!",
        description: `${paymentDialog.bill.name} foi marcada como paga.`,
      });

      setPaymentDialog({open: false, bill: null});
      setSelectedAccount('');
      await refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao marcar conta como paga.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="mr-2 h-5 w-5 text-yellow-400" />
            A Vencer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedBills.length > 0 ? (
            <div className="space-y-3">
              {sortedBills.map((bill) => (
                <div key={bill.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{bill.name}</p>
                    <p className="text-sm text-gray-400">
                      Vencimento: {new Date(bill.due_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end space-y-1">
                    <p className="font-bold text-white">
                      R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getBadgeVariant(bill.due_date)} className="text-xs">
                        {getBadgeText(bill.due_date)}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => setPaymentDialog({open: true, bill})}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma conta pendente</p>
              <p className="text-sm mt-1">Você está em dia!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para marcar como paga */}
      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({open, bill: paymentDialog.bill})}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Marcar como Paga</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">Conta: <span className="text-white font-medium">{paymentDialog.bill?.name}</span></p>
              <p className="text-gray-300 mb-4">Valor: <span className="text-white font-medium">R$ {paymentDialog.bill?.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
            </div>
            <div>
              <label className="text-gray-300 block mb-2">Conta para débito:</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="text-white">
                      {account.name} - R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleMarkAsPaid}
              disabled={processing || !selectedAccount}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {processing ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpcomingBillsAdvanced;
