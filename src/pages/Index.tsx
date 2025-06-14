import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PieChart, Settings } from "lucide-react";
import ExpenseTracker from "@/components/ExpenseTracker";
import BudgetManager from "@/components/BudgetManager";
import TransactionHistory from "@/components/TransactionHistory";
import SpendingChart from "@/components/SpendingChart";
import CurrencySelector from "@/components/CurrencySelector";
import { CurrencyProvider, useCurrency } from "@/contexts/CurrencyContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

const IndexContent = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const { formatAmount } = useCurrency();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update budget spent amounts
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const existingBudget = budgets.find(b => b.category === budget.category);
    if (existingBudget) {
      setBudgets(prev => prev.map(b => 
        b.category === budget.category
          ? { ...b, amount: budget.amount }
          : b
      ));
    } else {
      const newBudget = {
        ...budget,
        id: Date.now().toString(),
        spent: 0
      };
      setBudgets(prev => [...prev, newBudget]);
    }
  };

  const deleteBudget = (budgetId: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Budget Tracker</h1>
            <p className="text-muted-foreground">Monitor your expenses and manage your budgets effectively</p>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CurrencySelector />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatAmount(balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatAmount(totalExpenses)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Add Expense</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingChart transactions={transactions} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Budget Overview
                  </CardTitle>
                  <CardDescription>Track your spending against budgets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No budgets set yet. Go to the Budgets tab to create one.
                      </p>
                    ) : (
                      budgets.map(budget => {
                        const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                        const isOverBudget = percentage > 100;
                        
                        return (
                          <div key={budget.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{budget.category}</span>
                              <span className={isOverBudget ? 'text-red-600' : 'text-muted-foreground'}>
                                {formatAmount(budget.spent)} / {formatAmount(budget.amount)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {percentage.toFixed(1)}% used
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTracker onAddTransaction={addTransaction} budgets={budgets} />
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetManager budgets={budgets} onAddBudget={addBudget} onDeleteBudget={deleteBudget} />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory transactions={transactions} setTransactions={setTransactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <CurrencyProvider>
      <IndexContent />
    </CurrencyProvider>
  );
};

export default Index;
