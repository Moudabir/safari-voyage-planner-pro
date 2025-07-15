import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, DollarSign, Home, Car, UtensilsCrossed, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  category: 'stay' | 'transport' | 'food' | 'emergency';
  amount: number;
  description: string;
  date: string;
}

interface ExpenseTrackerProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

const categoryIcons = {
  stay: Home,
  transport: Car,
  food: UtensilsCrossed,
  emergency: AlertTriangle
};

const categoryColors = {
  stay: "text-safari-green",
  transport: "text-safari-orange",
  food: "text-safari-brown",
  emergency: "text-destructive"
};

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, setExpenses }) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState<{
    category: 'stay' | 'transport' | 'food' | 'emergency';
    amount: string;
    description: string;
    date: string;
  }>({
    category: 'stay',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.description) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: newExpense.date
      };
      setExpenses([...expenses, expense]);
      setNewExpense({
        category: 'stay',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsAddingExpense(false);
      toast({
        title: "Expense Added",
        description: `$${expense.amount} added to ${expense.category} expenses.`
      });
    }
  };

  const handleDeleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    setExpenses(expenses.filter(e => e.id !== id));
    toast({
      title: "Expense Removed",
      description: `$${expense?.amount} expense removed from ${expense?.category}.`
    });
  };

  const getCategoryTotal = (category: Expense['category']) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-safari-orange">Expense Tracker</h2>
          <p className="text-muted-foreground">
            Track all your trip expenses by category
          </p>
        </div>
        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogTrigger asChild>
            <Button className="bg-safari-orange hover:bg-safari-orange/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newExpense.category} onValueChange={(value: 'stay' | 'transport' | 'food' | 'emergency') => 
                  setNewExpense({...newExpense, category: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stay">Place of Stay</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What was this expense for?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
              <Button onClick={handleAddExpense} className="w-full bg-safari-orange hover:bg-safari-orange/90">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(categoryIcons).map(([category, Icon]) => (
          <Card key={category} className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {category === 'stay' ? 'Place of Stay' : category}
              </CardTitle>
              <Icon className={`h-4 w-4 ${categoryColors[category as keyof typeof categoryColors]}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${categoryColors[category as keyof typeof categoryColors]}`}>
                ${getCategoryTotal(category as Expense['category'])}
              </div>
              <p className="text-xs text-muted-foreground">
                {expenses.filter(e => e.category === category).length} expenses
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <Card className="border-safari-sand">
          <CardContent className="py-12">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No expenses tracked yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your trip expenses by adding your first expense
              </p>
              <Button 
                onClick={() => setIsAddingExpense(true)}
                className="bg-safari-orange hover:bg-safari-orange/90"
              >
                Add First Expense
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-safari-sand">
          <CardHeader>
            <CardTitle className="text-safari-brown">All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => {
                const Icon = categoryIcons[expense.category];
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-safari-cream rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${categoryColors[expense.category]}`} />
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {expense.category === 'stay' ? 'Place of Stay' : expense.category} • {expense.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${categoryColors[expense.category]}`}>
                        ${expense.amount}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Summary */}
      {expenses.length > 0 && (
        <Card className="border-safari-sand bg-gradient-to-r from-safari-orange/10 to-safari-green/10">
          <CardHeader>
            <CardTitle className="text-safari-brown">Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Expenses:</span>
                  <span className="font-bold text-safari-orange">${totalExpenses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average per expense:</span>
                  <span className="font-medium">${(totalExpenses / expenses.length).toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total transactions:</span>
                  <span className="font-medium">{expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Largest expense:</span>
                  <span className="font-medium">${Math.max(...expenses.map(e => e.amount))}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};