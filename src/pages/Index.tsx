import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Banknote, Calendar, MapPin, Clock, Activity, MessageCircle, Download, Upload, LogOut, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AttendeeTracker } from "@/components/AttendeeTracker";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { ScheduleManager } from "@/components/ScheduleManager";
import { TripSummary } from "@/components/TripSummary";
import { TripSelector } from "@/components/TripSelector";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTrip } from "@/hooks/useTrip";
import { useTabPersistence } from "@/hooks/useTabPersistence";
import { useDataLoader } from "@/hooks/useDataLoader";
import safariLogo from "@/assets/safari-logo.png";
import { useState } from "react";
const Index = () => {
  const [whatsappLink, setWhatsappLink] = useState("");
  const [isEditingWhatsapp, setIsEditingWhatsapp] = useState(false);
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
    allTrips,
    loading: tripLoading,
    selectTrip,
    refreshTrips
  } = useTrip();
  const {
    activeTab,
    updateActiveTab
  } = useTabPersistence("summary");
  const {
    attendees,
    expenses,
    schedule,
    dataLoading,
    updateAttendees,
    updateExpenses,
    updateSchedule
  } = useDataLoader(currentTrip, user, tripLoading);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('User not authenticated, redirecting to home');
      navigate("/");
    }
  }, [user, authLoading, navigate]);
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
  const confirmedAttendees = attendees.length;
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
      const attendeesCSV = [['Type', 'Name', 'Email', 'Phone'].join(','), ...attendees.map(a => ['attendee', `"${a.name}"`, `"${a.email || ''}"`, `"${a.phone || ''}"`].join(','))].join('\n');
      const expensesCSV = [['Type', 'Category', 'Amount', 'Description', 'Paid By', 'Date'].join(','), ...expenses.map(e => ['expense', e.category, e.amount, `"${e.description}"`, `"${e.paid_by}"`, e.created_at.split('T')[0]].join(','))].join('\n');
      const scheduleCSV = [['Type', 'Title', 'Time', 'Date', 'Schedule Type', 'Location', 'Pictures'].join(','), ...schedule.map(s => ['schedule', `"${s.title}"`, s.time, s.date, s.type, `"${s.location}"`, `"${(s.pictures || []).join(';')}"`].join('\n'))].join('\n');
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
  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const newAttendees: any[] = [];
    const newExpenses: any[] = [];
    const newSchedule: any[] = [];
    lines.forEach((line, index) => {
      if (index === 0 || !line.trim()) return;
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
        updateAttendees([...attendees, ...newAttendees]);
        updateExpenses([...expenses, ...newExpenses]);
        updateSchedule([...schedule, ...newSchedule]);
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
    event.target.value = '';
  };

  const handleWhatsappSave = () => {
    if (whatsappLink.trim()) {
      setIsEditingWhatsapp(false);
      toast({
        title: "WhatsApp Link Saved",
        description: "Group link has been saved successfully."
      });
    }
  };

  const openWhatsappGroup = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    } else {
      setIsEditingWhatsapp(true);
    }
  };
  return <div className="min-h-screen bg-background font-roboto">
      {/* Header */}
    <div className="bg-gradient-safari text-white p-4 md:p-6 shadow-safari">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <img src={safariLogo} alt="Safari" className="h-16 md:h-20 mb-1 md:mb-2" />
              <p className="text-sm md:text-lg opacity-90">Your Ultimate Travel Companion</p>
              <p className="text-xs md:text-sm opacity-75">Welcome back, {user.email}</p>
            </div>
          </div>
          
          {/* WhatsApp Group Button */}
          <div className="flex items-center justify-center flex-1 mx-4">
            {isEditingWhatsapp ? (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter WhatsApp group link"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  className="bg-white text-black placeholder:text-gray-500 min-w-[200px]"
                />
                <Button onClick={handleWhatsappSave} className="bg-green-500 hover:bg-green-600 text-white">
                  Save
                </Button>
                <Button onClick={() => setIsEditingWhatsapp(false)} variant="outline" className="bg-white text-black hover:bg-gray-100">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                onClick={openWhatsappGroup}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{whatsappLink ? "Open WhatsApp Group" : "Add WhatsApp Group"}</span>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:space-x-3 w-full md:w-auto">
            <input type="file" accept=".csv" onChange={importFromCSV} style={{
            display: 'none'
          }} id="csv-import" />
            
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white text-safari-green hover:bg-white/90 font-semibold text-sm px-3 py-2 md:px-4 md:py-2">
                  <Menu className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="p-2">
                  <TripSelector trips={allTrips} currentTrip={currentTrip} onTripSelect={selectTrip} onTripsUpdate={refreshTrips} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer rounded-full bg-cyan-100">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer bg-red-500 rounded-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <p className="text-xs text-muted-foreground">of {attendees.length} attendees</p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Banknote className="h-4 w-4 text-safari-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-safari-orange">{totalExpenses} DH</div>
              <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-safari-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-safari-brown">{upcomingActivities}</div>
              <p className="text-xs text-muted-foreground">activities planned</p>
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
        <Tabs value={activeTab} onValueChange={updateActiveTab} className="w-full">
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
            <AttendeeTracker attendees={attendees} setAttendees={updateAttendees} tripId={currentTrip.id} />
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <ExpenseTracker expenses={expenses} setExpenses={updateExpenses} tripId={currentTrip.id} attendees={attendees} />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <ScheduleManager schedule={schedule} setSchedule={updateSchedule} tripId={currentTrip.id} />
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
                            <Badge variant="default">Confirmed</Badge>
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