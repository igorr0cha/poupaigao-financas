
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Plus, Wallet, PiggyBank, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: CreditCard },
  { value: 'savings', label: 'Poupança', icon: PiggyBank },
  { value: 'investment', label: 'Investimento', icon: TrendingUp },
  { value: 'cash', label: 'Dinheiro', icon: DollarSign },
];

const accountColors = [
  '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

const Accounts = () => {
  const { user } = useAuth();
  const { accounts, refetch } = useFinancialData();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    balance: '',
    color: accountColors[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('accounts')
        .insert([{
          user_id: user.id,
          name: formData.name,
          type: formData.type,
          balance: parseFloat(formData.balance),
          color: formData.color
        }]);

      if (error) throw error;

      toast({
        title: "Conta criada!",
        description: "Sua conta foi adicionada com sucesso.",
      });

      setFormData({ name: '', type: '', balance: '', color: accountColors[0] });
      setIsOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url("${backgroundPattern}")` }}
      ></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Contas</h1>
            <p className="text-gray-400">Gerencie suas contas financeiras</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-green-800/30">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Nova Conta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nome da Conta</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Conta Corrente Banco do Brasil"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-300">Tipo da Conta</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white">
                          <div className="flex items-center">
                            <type.icon className="w-4 h-4 mr-2" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance" className="text-gray-300">Saldo Inicial</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Cor da Conta</Label>
                  <div className="flex gap-2">
                    {accountColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-white' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const AccountIcon = accountTypes.find(t => t.value === account.type)?.icon || Wallet;
            return (
              <Card key={account.id} className="bg-black/40 backdrop-blur-sm border-green-800/30 shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${account.color}20`, border: `1px solid ${account.color}40` }}
                      >
                        <AccountIcon className="w-6 h-6" style={{ color: account.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{account.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">
                          {accountTypes.find(t => t.value === account.type)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    R$ {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma conta cadastrada</h3>
            <p className="text-gray-500">Adicione sua primeira conta para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
