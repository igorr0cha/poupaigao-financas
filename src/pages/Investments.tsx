
import React, { useState } from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Plus, DollarSign, Target, BarChart3 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Investments = () => {
  const { 
    investments, 
    investmentTypes, 
    getTotalInvestments, 
    getInvestmentsByType,
    addInvestment,
    loading 
  } = useFinancialData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type_id: '',
    quantity: '',
    average_price: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await addInvestment({
        asset_name: formData.asset_name,
        asset_type_id: formData.asset_type_id,
        quantity: parseFloat(formData.quantity),
        average_price: parseFloat(formData.average_price)
      });

      if (error) throw error;

      toast({
        title: "Investimento adicionado!",
        description: "Seu ativo foi registrado com sucesso.",
      });

      setFormData({
        asset_name: '',
        asset_type_id: '',
        quantity: '',
        average_price: ''
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar investimento.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const investmentsByType = getInvestmentsByType();
  const totalInvested = getTotalInvestments();

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

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
              <TrendingUp className="mr-3 h-8 w-8 text-green-400" />
              Investimentos
            </h1>
            <p className="text-gray-400 mt-2">Gerencie seu portfólio de investimentos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Novo Investimento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-green-800/30">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Investimento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="asset_name" className="text-gray-300">Nome do Ativo</Label>
                  <Input
                    id="asset_name"
                    placeholder="ex: PETR4, Tesouro Selic 2029"
                    value={formData.asset_name}
                    onChange={(e) => setFormData({...formData, asset_name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asset_type" className="text-gray-300">Tipo de Ativo</Label>
                  <Select
                    value={formData.asset_type_id}
                    onValueChange={(value) => setFormData({...formData, asset_type_id: value})}
                    required
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {investmentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id} className="text-white">
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-gray-300">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="average_price" className="text-gray-300">Preço Médio</Label>
                    <Input
                      id="average_price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.average_price}
                      onChange={(e) => setFormData({...formData, average_price: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {saving ? 'Salvando...' : 'Adicionar Investimento'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Investido</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400">
                {investments.length} {investments.length === 1 ? 'ativo' : 'ativos'}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Tipos de Ativos</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {investmentsByType.length}
              </div>
              <p className="text-xs text-gray-400">
                Diversificação do portfólio
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Maior Posição</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {investments.length > 0 
                  ? `R$ ${Math.max(...investments.map(inv => inv.total_invested)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : 'R$ 0,00'
                }
              </div>
              <p className="text-xs text-gray-400">
                {investments.length > 0 
                  ? investments.find(inv => inv.total_invested === Math.max(...investments.map(i => i.total_invested)))?.asset_name
                  : 'Nenhum ativo'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              {investmentsByType.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investmentsByType}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {investmentsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                          'Valor Investido'
                        ]}
                        labelStyle={{ color: '#fff' }}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum investimento cadastrado</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Detalhes dos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {investments.length > 0 ? (
                  investments.map((investment) => (
                    <div key={investment.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{investment.asset_name}</p>
                        <p className="text-sm text-gray-400">
                          {investmentTypes.find(type => type.id === investment.asset_type_id)?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {investment.quantity} × R$ {investment.average_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          R$ {investment.total_invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>Nenhum ativo cadastrado ainda.</p>
                    <p className="text-sm mt-1">Clique em "Novo Investimento" para começar.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Investments;
