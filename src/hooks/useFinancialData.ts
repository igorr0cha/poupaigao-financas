
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category_id?: string;
}

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  priority: 'high' | 'medium' | 'low';
}

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

export const useFinancialData = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setAccounts([]);
      setTransactions([]);
      setGoals([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    try {
      const [accountsData, transactionsData, goalsData, categoriesData] = await Promise.all([
        supabase.from('accounts').select('*').eq('user_id', user.id),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('financial_goals').select('*').eq('user_id', user.id),
        supabase.from('expense_categories').select('*').eq('user_id', user.id)
      ]);

      if (accountsData.error) throw accountsData.error;
      if (transactionsData.error) throw transactionsData.error;
      if (goalsData.error) throw goalsData.error;
      if (categoriesData.error) throw categoriesData.error;

      setAccounts(accountsData.data || []);
      setTransactions(transactionsData.data || []);
      setGoals(goalsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + Number(account.balance), 0);
  };

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'income' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const getExpensesByCategory = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const categoryTotals = categories.map(category => {
      const total = monthlyExpenses
        .filter(t => t.category_id === category.id)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      return {
        name: category.name,
        value: total,
        color: category.color
      };
    }).filter(item => item.value > 0);

    return categoryTotals;
  };

  return {
    accounts,
    transactions,
    goals,
    categories,
    loading,
    getTotalBalance,
    getMonthlyIncome,
    getMonthlyExpenses,
    getExpensesByCategory,
    refetch: fetchAllData
  };
};
