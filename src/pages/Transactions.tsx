import React, { useState } from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Transactions = () => {
  const { 
    accounts, 
    categories, 
    addTransaction,
    loading 
  } = useFinancialData();

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    account_id: '',
    category_id: '',
    competence_month: new Date().getMonth() + 1,
    competence_year: new Date().getFullYear(),
    due_date: '',
    is_recurring: false,
    recurring_day: new Date().getDate()
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const transactionData: any = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        account_id: formData.account_id,
        competence_month: formData.competence_month,
        competence_year: formData.competence_year,
        date: new Date().toISOString().split('T')[0], // Data atual
        is_paid: formData.type === 'income' // Receitas são pagas por padrão, despesas não
      };

      if (formData.type === 'expense') {
        transactionData.category_id = formData.category_id;
        
        if (formData.due_date) {
          transactionData.due_date = formData.due_date;
        }
        
        if (formData.is_recurring) {
          transactionData.is_recurring = true;
          transactionData.recurring_day = formData.recurring_day;
        }
      }

      const { error } = await addTransaction(transactionData);

      if (error) throw error;

      toast({
        title: "Transação adicionada!",
        description: `${formData.type === 'income' ? 'Receita' : 'Despesa'} registrada com sucesso.`,
      });

      // Reset form but keep some values
      setFormData({
        type: formData.type,
        amount: '',
        description: '',
        account_id: formData.account_id,
        category_id: '',
        competence_month: formData.competence_month,
        competence_year: formData.competence_year,
        due_date: '',
        is_recurring: false,
        recurring_day: new Date().getDate()
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar transação.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  const backgroundSvg = `data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("${backgroundSvg}")` }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Plus className="mr-3 h-8 w-8 text-green-400" />
              Nova Transação
            </h1>
            <p className="text-gray-400 mt-2">Registre suas receitas e despesas</p>
          </div>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Detalhes da Transação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.type === 'income' ? 'default' : 'outline'}
                    onClick={() => setFormData({...formData, type: 'income'})}
                    className={`flex-1 ${
                      formData.type === 'income' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'border-green-600 text-green-400 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Receita
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === 'expense' ? 'default' : 'outline'}
                    onClick={() => setFormData({...formData, type: 'expense'})}
                    className={`flex-1 ${
                      formData.type === 'expense' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    <ArrowDownRight className="mr-2 h-4 w-4" />
                    Despesa
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">Valor *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                {/* Competência - Sempre visível */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="competence-month" className="text-gray-300">
                      <Calendar className="inline mr-2 h-4 w-4" />
                      Mês de Competência *
                    </Label>
                    <Select
                      value={formData.competence_month.toString()}
                      onValueChange={(value) => setFormData({...formData, competence_month: parseInt(value)})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {months.map((month, index) => (
                          <SelectItem key={index + 1} value={(index + 1).toString()} className="text-white">
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competence-year" className="text-gray-300">Ano de Competência *</Label>
                    <Input
                      id="competence-year"
                      type="number"
                      value={formData.competence_year}
                      onChange={(e) => setFormData({...formData, competence_year: parseInt(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Descrição *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva a transação..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account" className="text-gray-300">Conta *</Label>
                  <Select
                    value={formData.account_id}
                    onValueChange={(value) => setFormData({...formData, account_id: value})}
                    required
                  >
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

                {formData.type === 'expense' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">Categoria *</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({...formData, category_id: value})}
                        required
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="text-white">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due-date" className="text-gray-300">Data de Vencimento (opcional)</Label>
                      <Input
                        id="due-date"
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recurring"
                        checked={formData.is_recurring}
                        onCheckedChange={(checked) => setFormData({...formData, is_recurring: !!checked})}
                      />
                      <Label htmlFor="recurring" className="text-gray-300">Despesa Recorrente</Label>
                    </div>

                    {formData.is_recurring && (
                      <div className="space-y-2">
                        <Label htmlFor="recurring-day" className="text-gray-300">Dia do mês para recorrência</Label>
                        <Input
                          id="recurring-day"
                          type="number"
                          value={formData.recurring_day}
                          onChange={(e) => setFormData({...formData, recurring_day: parseInt(e.target.value)})}
                          className="bg-gray-800 border-gray-700 text-white"
                          min="1"
                          max="31"
                        />
                      </div>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {saving ? 'Salvando...' : `Adicionar ${formData.type === 'income' ? 'Receita' : 'Despesa'}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
