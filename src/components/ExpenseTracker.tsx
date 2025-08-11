import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Banknote, Home, Car, UtensilsCrossed, AlertTriangle, Activity, Edit2 } from "lucide-react";
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

interface Attendee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface ExpensePayer {
  id: string;
  expense_id: string;
  attendee_id: string | null;
  payer_name: string;
  amount: number;
  created_at: string;
}

interface ExpenseTrackerProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  tripId: string;
  attendees: Attendee[];
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
  tripId,
  attendees 
}) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
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
  const [editForm, setEditForm] = useState<{
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

  // Multiple payers state
  const [payersByExpense, setPayersByExpense] = useState<Record<string, ExpensePayer[]>>({});
  const [newPayers, setNewPayers] = useState<Record<string, { name: string; amount: string }>>({});
  const [editPayers, setEditPayers] = useState<Record<string, { name: string; amount: string }>>({});

  // Helpers
  const splitEqually = (map: Record<string, { name: string; amount: string }>, total: number) => {
    const keys = Object.keys(map);
    if (keys.length === 0) return map;
    const per = Math.floor((total / keys.length) * 100) / 100; // 2 decimals
    const adjusted = { ...map };
    let running = 0;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        const last = (total - running).toFixed(2);
        adjusted[k] = { ...adjusted[k], amount: last };
      } else {
        adjusted[k] = { ...adjusted[k], amount: per.toFixed(2) };
        running += per;
      }
    });
    return adjusted;
  };

  const sumMap = (map: Record<string, { name: string; amount: string }>) =>
    Object.values(map).reduce((s, v) => s + (parseFloat(v.amount || '0') || 0), 0);


  useEffect(() => {
    if (tripId && user) {
      loadExpenses();
    }
  }, [tripId, user]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data: exp, error: expErr } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (expErr) throw expErr;
      setExpenses(exp);

      if (exp.length > 0) {
        const ids = exp.map(e => e.id);
        const { data: payers, error: payErr } = await (supabase as any)
          .from('expense_payers')
          .select('*')
          .in('expense_id', ids);
        if (payErr) throw payErr;
        const map: Record<string, ExpensePayer[]> = {};
        const payersArr = (payers || []) as ExpensePayer[];
        payersArr.forEach((p) => {
          if (!map[p.expense_id]) map[p.expense_id] = [];
          map[p.expense_id].push(p);
        });
        setPayersByExpense(map);
      } else {
        setPayersByExpense({});
      }
    } catch (error: any) {
      console.error('Failed to load expenses:', error);
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
    if (!newExpense.amount || !newExpense.description || !user) return;

    const total = parseFloat(newExpense.amount);
    const selectedIds = Object.keys(newPayers);
    if (selectedIds.length === 0) {
      toast({ title: 'Select payers', description: 'Choose at least one payer.', variant: 'destructive' });
      return;
    }
    const assigned = sumMap(newPayers);
    if (Math.abs(assigned - total) > 0.01) {
      toast({ title: 'Amounts do not match', description: 'Sum of payer amounts must equal total.', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const paidByLabel = selectedIds.length === 1 ? newPayers[selectedIds[0]].name : 'Multiple';
      const { data: exp, error } = await supabase
        .from('expenses')
        .insert([
          {
            trip_id: tripId,
            user_id: user.id,
            category: newExpense.category,
            amount: total,
            description: newExpense.description,
            paid_by: paidByLabel
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const rows = selectedIds.map((id) => ({
        expense_id: exp.id,
        attendee_id: id,
        payer_name: newPayers[id].name,
        amount: parseFloat(newPayers[id].amount)
      }));
      const { error: payErr } = await (supabase as any).from('expense_payers').insert(rows);
      if (payErr) throw payErr;

      setExpenses([exp, ...expenses]);
      setPayersByExpense((prev) => ({ ...prev, [exp.id]: rows.map((r, i) => ({ ...r, id: `${exp.id}-${i}`, created_at: new Date().toISOString() })) as ExpensePayer[] }));

      setNewExpense({ category: 'food', amount: '', description: '', paid_by: '' });
      setNewPayers({});
      setIsAddingExpense(false);
      toast({ title: 'Expense Added', description: `${exp.amount} DH added to ${exp.category} expenses.` });
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setEditForm({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      paid_by: expense.paid_by
    });
    // Init edit payers from existing
    const current = payersByExpense[expense.id] || [];
    const map: Record<string, { name: string; amount: string }> = {};
    current.forEach(p => { if (p.attendee_id) map[p.attendee_id] = { name: p.payer_name, amount: p.amount.toString() }; });
    setEditPayers(map);
    setIsEditingExpense(true);
  };

  const handleUpdateExpense = async () => {
    if (!editingExpense || !editForm.amount || !editForm.description || !editForm.paid_by || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .update({
          category: editForm.category,
          amount: parseFloat(editForm.amount),
          description: editForm.description,
          paid_by: editForm.paid_by
        })
        .eq('id', editingExpense.id)
        .select()
        .single();

      if (error) throw error;

      setExpenses(expenses.map(e => e.id === editingExpense.id ? data : e));
      setIsEditingExpense(false);
      setEditingExpense(null);
      toast({
        title: "Expense Updated",
        description: `${data.description} has been updated successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 md:mb-0">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold text-safari-orange">Expense Tracker</h2>
          <p className="text-sm md:text-base text-muted-foreground">
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
                <div className="flex items-center justify-between">
                  <Label>Paid By (select multiple)</Label>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const total = parseFloat(newExpense.amount || '0') || 0;
                      setNewPayers(prev => splitEqually(prev, total));
                    }}
                  >
                    Split equally
                  </Button>
                </div>
                <div className="mt-2 space-y-2 max-h-56 overflow-auto pr-1">
                  {attendees.map((attendee) => {
                    const selected = !!newPayers[attendee.id];
                    return (
                      <div key={attendee.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`payer-${attendee.id}`}
                            checked={selected}
                            onCheckedChange={(checked) => {
                              setNewPayers(prev => {
                                const next = { ...prev };
                                if (checked) {
                                  next[attendee.id] = { name: attendee.name, amount: next[attendee.id]?.amount || '' };
                                } else {
                                  delete next[attendee.id];
                                }
                                return next;
                              });
                            }}
                          />
                          <Label htmlFor={`payer-${attendee.id}`}>{attendee.name}</Label>
                        </div>
                        <Input
                          className="w-28"
                          type="number"
                          placeholder="0.00"
                          value={newPayers[attendee.id]?.amount || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewPayers(prev => ({
                              ...prev,
                              [attendee.id]: { name: attendee.name, amount: val }
                            }));
                          }}
                          disabled={!selected}
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total assigned: {sumMap(newPayers).toFixed(2)} / {parseFloat(newExpense.amount || '0').toFixed(2)} DH
                </p>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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
                           {expense.category} • {payersByExpense[expense.id]?.length
                             ? `Paid by ${payersByExpense[expense.id].map(p => `${p.payer_name} (${p.amount} DH)`).join(', ')}`
                             : `Paid by ${expense.paid_by}`
                           } • {expense.created_at.split('T')[0]}
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
                         onClick={() => handleEditExpense(expense)}
                         className="text-safari-orange hover:text-safari-orange hover:bg-safari-orange/10"
                       >
                         <Edit2 className="h-4 w-4" />
                       </Button>
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

      {/* Edit Expense Dialog */}
      <Dialog open={isEditingExpense} onOpenChange={setIsEditingExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editForm.category} onValueChange={(value: 'food' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other') => 
                setEditForm({...editForm, category: value})
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
              <Label htmlFor="edit-amount">Amount (DH)</Label>
              <Input
                id="edit-amount"
                type="number"
                placeholder="0.00"
                value={editForm.amount}
                onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="What was this expense for?"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-paid_by">Paid By</Label>
              <Select value={editForm.paid_by} onValueChange={(value) => 
                setEditForm({...editForm, paid_by: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {attendees.map((attendee) => (
                    <SelectItem key={attendee.id} value={attendee.name}>
                      {attendee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleUpdateExpense} 
              className="w-full bg-safari-orange hover:bg-safari-orange/90"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};