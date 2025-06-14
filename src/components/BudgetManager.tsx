import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, AlertTriangle, Trash2 } from "lucide-react";
import { Budget } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BudgetManagerProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onDeleteBudget: (budgetId: string) => void;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other"
];

const BudgetManager = ({ budgets, onAddBudget, onDeleteBudget }: BudgetManagerProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const { selectedCurrency, formatAmount } = useCurrency();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    onAddBudget({
      category,
      amount: numAmount
    });

    // Reset form
    setAmount("");
    setCategory("");

    toast({
      title: "Success",
      description: "Budget updated successfully",
    });
  };

  const handleDeleteBudget = (budgetId: string, category: string) => {
    onDeleteBudget(budgetId);
    toast({
      title: "Success",
      description: `Budget for ${category} deleted successfully`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Budget Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set Budget
          </CardTitle>
          <CardDescription>
            Create or update budget limits for different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount ({selectedCurrency.symbol})</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-right"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Set Budget
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No budgets set</h3>
              <p className="text-muted-foreground">
                Create your first budget to start tracking your spending limits
              </p>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => {
            const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && !isOverBudget;
            
            return (
              <Card key={budget.id} className={`${isOverBudget ? 'border-red-500' : isNearLimit ? 'border-yellow-500' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{budget.category}</CardTitle>
                    <div className="flex items-center gap-2">
                      {isOverBudget && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {isNearLimit && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the budget for {budget.category}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteBudget(budget.id, budget.category)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className={`font-medium ${isOverBudget ? 'text-red-600' : ''}`}>
                      {formatAmount(budget.spent)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{formatAmount(budget.amount)}</span>
                  </div>

                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
                  />

                  <div className="flex justify-between text-xs">
                    <span className={`${isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className="text-muted-foreground">
                      {formatAmount(budget.amount - budget.spent)} remaining
                    </span>
                  </div>

                  {isOverBudget && (
                    <div className="text-xs text-red-600 font-medium">
                      Over budget by {formatAmount(budget.spent - budget.amount)}
                    </div>
                  )}

                  {isNearLimit && (
                    <div className="text-xs text-yellow-600 font-medium">
                      Approaching budget limit
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
