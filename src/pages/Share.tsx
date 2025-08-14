import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import safariLogo from "@/assets/safari-logo.png";

interface ShareData {
  tripId: string;
  attendees: any[];
  expenses: any[];
  schedule: any[];
}

const Share = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Shared Trip | Safari Planner";
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const { data, error } = await supabase.functions.invoke("share-trip", {
          body: { token },
        });
        if (error) throw error;
        setData(data as ShareData);
      } catch (e: any) {
        setError(e?.message || "Unable to load shared trip.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading shared trip…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">This link isn’t available</h1>
          <p className="text-muted-foreground text-sm">
            The share link may be expired or revoked. Please ask the coordinator for a new link.
          </p>
        </div>
      </div>
    );
  }

  const totalExpenses = data.expenses.reduce((sum, e: any) => sum + Number(e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-safari-cream/30 font-roboto">
      <header className="bg-card border-b border-safari-sand shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={safariLogo} alt="Safari" className="h-8 w-8" />
            <span className="text-xl font-bold text-safari-green">Safari</span>
          </div>
          <Badge variant="outline" className="border-safari-green text-safari-green">Read-only</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-safari text-white border-safari-green">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shared Trip Overview</h1>
            <p className="text-safari-cream/90">View the latest details for this amazing adventure</p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-safari-green">Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-safari-green">{data.attendees.length}</p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-safari-green">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-safari-orange">{totalExpenses} DH</p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-safari-green">Schedule Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-safari-brown">{data.schedule.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Section */}
        <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50">
          <CardHeader>
            <CardTitle className="text-safari-green">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {data.schedule.length > 0 ? (
              <ul className="space-y-3">
                {data.schedule.map((s: any) => (
                  <li key={s.id} className="flex justify-between items-center p-3 bg-white/50 rounded-lg border border-safari-sand">
                    <span className="font-medium text-safari-green">{s.title}</span>
                    <span className="text-safari-brown text-sm">{s.date}{s.time ? ` • ${s.time}` : ''}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No schedule items yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Expense Details Section */}
        <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50">
          <CardHeader>
            <CardTitle className="text-safari-green">Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            {data.expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-safari-sand">
                      <TableHead className="text-safari-green font-semibold">Description</TableHead>
                      <TableHead className="text-safari-green font-semibold">Category</TableHead>
                      <TableHead className="text-safari-green font-semibold">Amount</TableHead>
                      <TableHead className="text-safari-green font-semibold">Payers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.expenses.map((expense: any) => (
                      <TableRow key={expense.id} className="border-safari-sand hover:bg-safari-cream/30">
                        <TableCell className="font-medium text-safari-green">{expense.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-safari-orange text-safari-orange">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-safari-orange">{expense.amount} DH</TableCell>
                        <TableCell>
                          {expense.payers && expense.payers.length > 0 ? (
                            <div className="space-y-1">
                              {expense.payers.map((payer: any, index: number) => (
                                <div key={index} className="text-sm bg-white/50 p-2 rounded border border-safari-sand">
                                  <span className="font-medium text-safari-green">{payer.payer_name}</span>: 
                                  <span className="text-safari-orange font-semibold ml-1">{payer.amount} DH</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-safari-brown bg-white/50 p-2 rounded border border-safari-sand">
                              {expense.paid_by}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No expenses recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Attendees Section */}
        <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50">
          <CardHeader>
            <CardTitle className="text-safari-green">Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            {data.attendees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.attendees.map((a: any) => (
                  <div key={a.id} className="bg-white/50 p-3 rounded-lg border border-safari-sand">
                    <span className="text-safari-green font-medium">{a.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No attendees yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-safari text-white border-safari-green shadow-safari">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Want to be the manager of your own trips? Sign up and start planning!
            </h2>
            <Button asChild size="lg" className="bg-white text-safari-green hover:bg-white/90 font-semibold">
              <Link to="/auth">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Share;
