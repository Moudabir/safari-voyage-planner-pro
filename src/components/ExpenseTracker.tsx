import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Banknote, Home, Car, UtensilsCrossed, AlertTriangle, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Expense {
  id: string;
  category: 'food' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other';
  amount: number;
  description: string;
  paid_by: string;
  trip_id: string;
  user_id: string;
  created_at: string;
}

interface ExpenseTrackerProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  tripId: string;
}

const categoryIcons = {
  food: UtensilsCrossed,
  transport: Car,
  accommodation: Home,
  entertainment: Activity,
  shopping: Banknote,
  other: Activity
};

const categoryColors = {
  food: "text-safari-brown",
  transport: "text-safari-orange",
  accommodation: "text-safari-green",
  entertainment: "text-primary",
  shopping: "text-safari-sand",
  other: "text-muted-foreground"
};

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ 
  expenses, 
  setExpenses, 
  tripId 
}) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newExpense, setNewExpense] = useState<{
    category: 'food' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other';
    amount: string;
    description: string;
    paid_by: string;
  }>({
    category: 'food',
    amount: '',
    description: '',
    paid_by: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (tripId && user) {
      loadExpenses();
    }
  }, [tripId, user]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setExpenses(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description || !newExpense.paid_by || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            trip_id: tripId,
            user_id: user.id,
            category: newExpense.category,
            amount: parseFloat(newExpense.amount),
            description: newExpense.description,
            paid_by: newExpense.paid_by
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setExpenses([data, ...expenses]);
      setNewExpense({
        category: 'food',
        amount: '',
        description: '',
        paid_by: ''
      });
      setIsAddingExpense(false);
      toast({
        title: "Expense Added",
        description: `${data.amount} DH added to ${data.category} expenses.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const expense = expenses.find(e => e.id === id);
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(expenses.filter(e => e.id !== id));
      toast({
        title: "Expense Removed",
        description: `${expense?.amount} DH expense removed from ${expense?.category}.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove expense",
        variant: "destructive",
      });
    }
  };

  const getCategoryTotal = (category: Expense['category']) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading && expenses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <Select value={newExpense.category} onValueChange={(value: 'food' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other') => 
                  setNewExpense({...newExpense, category: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount (DH)</Label>
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
                <Label htmlFor="paid_by">Paid By</Label>
                <Input
                  id="paid_by"
                  placeholder="Who paid for this?"
                  value={newExpense.paid_by}
                  onChange={(e) => setNewExpense({...newExpense, paid_by: e.target.value})}
                />
              </div>
              <Button 
                onClick={handleAddExpense} 
                className="w-full bg-safari-orange hover:bg-safari-orange/90"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(categoryIcons).map(([category, Icon]) => (
          <Card key={category} className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {category}
              </CardTitle>
              <Icon className={`h-4 w-4 ${categoryColors[category as keyof typeof categoryColors]}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${categoryColors[category as keyof typeof categoryColors]}`}>
                {getCategoryTotal(category as Expense['category'])} DH
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
              <Banknote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
                           {expense.category} • Paid by {expense.paid_by} • {expense.created_at.split('T')[0]}
                         </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${categoryColors[expense.category]}`}>
                        {expense.amount} DH
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
                  <span className="font-bold text-safari-orange">{totalExpenses} DH</span>
                </div>
                <div className="flex justify-between">
                  <span>Average per expense:</span>
                  <span className="font-medium">{(totalExpenses / expenses.length).toFixed(2)} DH</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total transactions:</span>
                  <span className="font-medium">{expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Largest expense:</span>
                  <span className="font-medium">{Math.max(...expenses.map(e => e.amount))} DH</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};