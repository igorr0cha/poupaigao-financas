
import React, { useState } from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Receipt } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Expenses = () => {
  const { user } = useAuth();
  const { categories, transactions, loading, refetch } = useFinancialData();
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6B7280' });
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const handleAddCategory = async () => {
    if (!user || !newCategory.name.trim()) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('expense_categories')
        .insert({
          name: newCategory.name,
          color: newCategory.color,
          user_id: user.id,
          is_user_created: true
        });

      if (error) throw error;

      toast({
        title: "Categoria criada!",
        description: "Nova categoria de despesa adicionada com sucesso.",
      });

      setNewCategory({ name: '', color: '#6B7280' });
      setIsDialogOpen(false);
      await refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar categoria.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('expense_categories')
        .update({
          name: editingCategory.name,
          color: editingCategory.color
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: "Categoria atualizada!",
        description: "Categoria editada com sucesso.",
      });

      setEditingCategory(null);
      await refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao editar categoria.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('expense_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Categoria excluída!",
        description: "Categoria removida com sucesso.",
      });

      await refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir categoria.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("${backgroundSvg}")` }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Receipt className="mr-3 h-8 w-8 text-green-400" />
            Gestão de Despesas
          </h1>
          <p className="text-gray-400 mt-2">Gerencie suas categorias e despesas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Categorias */}
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Categorias de Despesa</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Nova Categoria</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Nome</Label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Nome da categoria"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color" className="text-gray-300">Cor</Label>
                      <Input
                        id="color"
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                        className="bg-gray-800 border-gray-700 h-12 w-full"
                      />
                    </div>
                    <Button 
                      onClick={handleAddCategory}
                      disabled={saving}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {saving ? 'Salvando...' : 'Criar Categoria'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    {category.is_user_created && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCategory(category)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Despesas */}
          <Card className="backdrop-blur-sm bg-black/40 border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Resumo do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Total de Despesas</p>
                  <p className="text-2xl font-bold text-red-400">
                    R$ {expenseTransactions
                      .filter(t => {
                        const date = new Date(t.date);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                      })
                      .reduce((sum, t) => sum + Number(t.amount), 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Número de Transações</p>
                  <p className="text-xl font-semibold text-white">
                    {expenseTransactions.filter(t => {
                      const date = new Date(t.date);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog para editar categoria */}
        {editingCategory && (
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Editar Categoria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" className="text-gray-300">Nome</Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color" className="text-gray-300">Cor</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                    className="bg-gray-800 border-gray-700 h-12 w-full"
                  />
                </div>
                <Button 
                  onClick={handleEditCategory}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Expenses;
