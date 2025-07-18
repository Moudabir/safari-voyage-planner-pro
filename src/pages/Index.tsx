import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Banknote, Calendar, MapPin, Clock, Activity, MessageCircle, Download, Upload, LogOut } from "lucide-react";
import { AttendeeTracker } from "@/components/AttendeeTracker";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { ScheduleManager } from "@/components/ScheduleManager";
import { TripSummary } from "@/components/TripSummary";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTrip } from "@/hooks/useTrip";
import { supabase } from "@/integrations/supabase/client";
import safariLogo from "@/assets/safari-logo.png";
interface Attendee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  trip_id: string;
  user_id: string;
  created_at: string;
}
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
interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'gathering' | 'activity';
  location: string;
  pictures: string[];
}
const Index = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const {
    toast
  } = useToast();
  const {
    user,
    loading: authLoading,
    signOut
  } = useAuth();
  const {
    currentTrip,
    loading: tripLoading
  } = useTrip();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Preload all data when trip is available
  useEffect(() => {
    if (currentTrip && user && !tripLoading) {
      preloadData();
    }
  }, [currentTrip, user, tripLoading]);
  const preloadData = async () => {
    if (!currentTrip || !user) return;
    setDataLoading(true);
    try {
      // Load all data in parallel for better performance
      const [attendeesData, expensesData, scheduleData] = await Promise.all([supabase.from('attendees').select('*').eq('trip_id', currentTrip.id).order('created_at', {
        ascending: true
      }), supabase.from('expenses').select('*').eq('trip_id', currentTrip.id).order('created_at', {
        ascending: false
      }), supabase.from('schedule_items').select('*').eq('trip_id', currentTrip.id).order('date', {
        ascending: true
      })]);
      if (attendeesData.data) setAttendees(attendeesData.data);
      if (expensesData.data) setExpenses(expensesData.data);
      if (scheduleData.data) {
        const formattedSchedule = scheduleData.data.map(item => ({
          id: item.id,
          title: item.title,
          time: item.time || '',
          date: item.date,
          type: 'activity' as 'gathering' | 'activity',
          location: item.description || '',
          pictures: item.pictures || []
        }));
        setSchedule(formattedSchedule);
      }
    } catch (error) {
      console.error('Error preloading data:', error);
      toast({
        title: "Error",
        description: "Failed to load trip data",
        variant: "destructive"
      });
    } finally {
      setDataLoading(false);
    }
  };
  if (authLoading || tripLoading || dataLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">
            {authLoading ? "Authenticating..." : tripLoading ? "Loading trip..." : "Loading your data..."}
          </p>
        </div>
      </div>;
  }
  if (!user || !currentTrip) {
    return null;
  }
  const confirmedAttendees = attendees.length; // All stored attendees are considered confirmed
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const upcomingActivities = schedule.filter(item => new Date(item.date) >= new Date()).length;

  // CSV Export Functions
  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToCSV = () => {
    try {
      // Export Attendees
      const attendeesCSV = [['Type', 'Name', 'Email', 'Phone'].join(','), ...attendees.map(a => ['attendee', `"${a.name}"`, `"${a.email || ''}"`, `"${a.phone || ''}"`].join(','))].join('\n');

      // Export Expenses
      const expensesCSV = [['Type', 'Category', 'Amount', 'Description', 'Paid By', 'Date'].join(','), ...expenses.map(e => ['expense', e.category, e.amount, `"${e.description}"`, `"${e.paid_by}"`, e.created_at.split('T')[0]].join(','))].join('\n');

      // Export Schedule
      const scheduleCSV = [['Type', 'Title', 'Time', 'Date', 'Schedule Type', 'Location', 'Pictures'].join(','), ...schedule.map(s => ['schedule', `"${s.title}"`, s.time, s.date, s.type, `"${s.location}"`, `"${(s.pictures || []).join(';')}"`].join(','))].join('\n');

      // Combine all data
      const allData = [attendeesCSV, expensesCSV, scheduleCSV].join('\n');
      downloadCSV(allData, 'safari-trip-data.csv');
      toast({
        title: "Data Exported",
        description: "All trip data has been exported to CSV successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data to CSV.",
        variant: "destructive"
      });
    }
  };

  // CSV Import Functions
  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const newAttendees: Attendee[] = [];
    const newExpenses: Expense[] = [];
    const newSchedule: ScheduleItem[] = [];
    lines.forEach((line, index) => {
      if (index === 0 || !line.trim()) return; // Skip headers and empty lines

      const values = line.split(',').map(val => val.replace(/^"/, '').replace(/"$/, ''));
      const type = values[0];
      try {
        if (type === 'attendee' && values.length >= 4) {
          newAttendees.push({
            id: Date.now().toString() + Math.random(),
            name: values[1],
            email: values[2] || null,
            phone: values[3] || null,
            trip_id: currentTrip.id,
            user_id: user.id,
            created_at: new Date().toISOString()
          });
        } else if (type === 'expense' && values.length >= 6) {
          newExpenses.push({
            id: Date.now().toString() + Math.random(),
            category: values[1] as 'food' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other',
            amount: parseFloat(values[2]) || 0,
            description: values[3],
            paid_by: values[4] || 'Unknown',
            trip_id: currentTrip.id,
            user_id: user.id,
            created_at: values[5] || new Date().toISOString()
          });
        } else if (type === 'schedule' && values.length >= 7) {
          newSchedule.push({
            id: Date.now().toString() + Math.random(),
            title: values[1],
            time: values[2],
            date: values[3],
            type: values[4] as 'gathering' | 'activity',
            location: values[5],
            pictures: values[6] ? values[6].split(';').filter(p => p.trim()) : []
          });
        }
      } catch (error) {
        console.warn(`Error parsing line ${index + 1}:`, line);
      }
    });
    return {
      newAttendees,
      newExpenses,
      newSchedule
    };
  };
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const csvText = e.target?.result as string;
        const {
          newAttendees,
          newExpenses,
          newSchedule
        } = parseCSV(csvText);

        // Update state with imported data
        setAttendees(prev => [...prev, ...newAttendees]);
        setExpenses(prev => [...prev, ...newExpenses]);
        setSchedule(prev => [...prev, ...newSchedule]);
        toast({
          title: "Data Imported",
          description: `Imported ${newAttendees.length} attendees, ${newExpenses.length} expenses, and ${newSchedule.length} schedule items.`
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import CSV data. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-safari text-white p-4 md:p-6 shadow-safari">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <img src={safariLogo} alt="Safari" className="h-16 md:h-20 mb-1 md:mb-2" />
            <p className="text-sm md:text-lg opacity-90">Your Ultimate Travel Companion</p>
            <p className="text-xs md:text-sm opacity-75">Welcome back, {user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2 md:space-x-3 w-full md:w-auto">
            <input type="file" accept=".csv" onChange={importFromCSV} style={{
            display: 'none'
          }} id="csv-import" />
            <Button onClick={() => document.getElementById('csv-import')?.click()} className="bg-white text-safari-green hover:bg-white/90 font-semibold text-sm px-3 py-2 md:px-4 md:py-2">
              <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button onClick={exportToCSV} className="bg-white text-safari-green hover:bg-white/90 font-semibold text-sm px-3 py-2 md:px-4 md:py-2">
              <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            <Button onClick={signOut} className="bg-white text-safari-green hover:bg-white/90 font-semibold text-sm px-3 py-2 md:px-4 md:py-2">
              <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Users className="h-4 w-4 text-safari-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-safari-green">{confirmedAttendees}</div>
              <p className="text-xs text-muted-foreground">
                of {attendees.length} attendees
              </p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Banknote className="h-4 w-4 text-safari-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-safari-orange">{totalExpenses} DH</div>
              <p className="text-xs text-muted-foreground">
                {expenses.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-safari-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-safari-brown">{upcomingActivities}</div>
              <p className="text-xs text-muted-foreground">
                activities planned
              </p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trip Status</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {confirmedAttendees > 0 ? "Active" : "Planning"}
              </div>
              <p className="text-xs text-muted-foreground">
                {confirmedAttendees > 0 ? "Ready to go!" : "Still organizing"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-safari-sand text-xs md:text-sm">
            <TabsTrigger value="summary" className="data-[state=active]:bg-safari-green data-[state=active]:text-white px-2 md:px-4">
              <span className="hidden sm:inline">Summary</span>
              <span className="sm:hidden">Sum</span>
            </TabsTrigger>
            <TabsTrigger value="attendees" className="data-[state=active]:bg-safari-green data-[state=active]:text-white px-2 md:px-4">
              <span className="hidden sm:inline">Attendees</span>
              <span className="sm:hidden">Att</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-safari-green data-[state=active]:text-white px-2 md:px-4">
              <span className="hidden sm:inline">Budget</span>
              <span className="sm:hidden">Exp</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-safari-green data-[state=active]:text-white px-2 md:px-4">
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Sch</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-safari-green data-[state=active]:text-white px-2 md:px-4">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Ovr</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <TripSummary attendees={attendees} expenses={expenses} schedule={schedule} />
          </TabsContent>

          <TabsContent value="attendees" className="mt-6">
            <AttendeeTracker attendees={attendees} setAttendees={setAttendees} tripId={currentTrip.id} />
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <ExpenseTracker expenses={expenses} setExpenses={setExpenses} tripId={currentTrip.id} />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <ScheduleManager schedule={schedule} setSchedule={setSchedule} tripId={currentTrip.id} />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-safari-sand">
                <CardHeader>
                  <CardTitle className="text-safari-green">Trip Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Attendee Confirmations</span>
                      <span className="text-sm text-muted-foreground">
                        {confirmedAttendees}/{attendees.length}
                      </span>
                    </div>
                    <Progress value={attendees.length > 0 ? confirmedAttendees / attendees.length * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Schedule Completion</span>
                      <span className="text-sm text-muted-foreground">
                        {schedule.length}/10 planned
                      </span>
                    </div>
                    <Progress value={schedule.length / 10 * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-safari-sand">
                <CardHeader>
                  <CardTitle className="text-safari-orange">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendees.length === 0 && expenses.length === 0 && schedule.length === 0 ? <p className="text-muted-foreground text-center py-4">
                        No recent activity. Start by adding attendees!
                      </p> : <>
                        {attendees.slice(0, 3).map(attendee => <div key={attendee.id} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-safari-green rounded-full" />
                            <span className="text-sm">{attendee.name} joined the trip</span>
                            <Badge variant="default">
                              Confirmed
                            </Badge>
                          </div>)}
                        {expenses.slice(0, 2).map(expense => <div key={expense.id} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-safari-orange rounded-full" />
                            <span className="text-sm">
                              {expense.amount} DH added to {expense.category}
                            </span>
                          </div>)}
                      </>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Index;