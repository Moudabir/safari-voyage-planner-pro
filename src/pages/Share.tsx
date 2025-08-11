import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-background">
      <header className="p-6 border-b">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Shared Trip Overview</h1>
          <Badge>Read-only</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.attendees.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalExpenses} DH</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.schedule.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.schedule.map((s: any) => (
                <li key={s.id} className="text-sm flex justify-between">
                  <span className="font-medium">{s.title}</span>
                  <span className="text-muted-foreground">{s.date}{s.time ? ` • ${s.time}` : ''}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.attendees.map((a: any) => (
                <li key={a.id} className="text-sm">{a.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Share;
