import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Banknote, Calendar, MapPin, Clock, Activity, MessageCircle } from "lucide-react";
import { AttendeeTracker } from "@/components/AttendeeTracker";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { ScheduleManager } from "@/components/ScheduleManager";
import { TripSummary } from "@/components/TripSummary";

interface Attendee {
  id: string;
  name: string;
  whatsapp: string;
  confirmed: boolean;
  pickupLocation: string;
}

interface Expense {
  id: string;
  category: 'stay' | 'transport' | 'food' | 'emergency' | 'other';
  amount: number;
  description: string;
  date: string;
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

  const confirmedAttendees = attendees.filter(a => a.confirmed).length;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const upcomingActivities = schedule.filter(item => new Date(item.date) >= new Date()).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-safari text-white p-6 shadow-safari">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">SAFARI</h1>
            <p className="text-lg opacity-90">Your Ultimate Travel Companion</p>
          </div>
          <Button
            onClick={() => window.open('https://wa.me/', '_blank')}
            className="bg-white text-safari-green hover:bg-white/90 font-semibold"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Communication
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          <TabsList className="grid w-full grid-cols-5 bg-safari-sand">
            <TabsTrigger value="summary" className="data-[state=active]:bg-safari-green data-[state=active]:text-white">
              Summary
            </TabsTrigger>
            <TabsTrigger value="attendees" className="data-[state=active]:bg-safari-green data-[state=active]:text-white">
              Attendees
            </TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-safari-green data-[state=active]:text-white">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-safari-green data-[state=active]:text-white">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-safari-green data-[state=active]:text-white">
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <TripSummary 
              attendees={attendees}
              expenses={expenses}
              schedule={schedule}
            />
          </TabsContent>

          <TabsContent value="attendees" className="mt-6">
            <AttendeeTracker 
              attendees={attendees}
              setAttendees={setAttendees}
            />
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <ExpenseTracker 
              expenses={expenses}
              setExpenses={setExpenses}
            />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <ScheduleManager 
              schedule={schedule}
              setSchedule={setSchedule}
            />
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
                    <Progress 
                      value={attendees.length > 0 ? (confirmedAttendees / attendees.length) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Schedule Completion</span>
                      <span className="text-sm text-muted-foreground">
                        {schedule.length}/10 planned
                      </span>
                    </div>
                    <Progress 
                      value={(schedule.length / 10) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-safari-sand">
                <CardHeader>
                  <CardTitle className="text-safari-orange">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendees.length === 0 && expenses.length === 0 && schedule.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No recent activity. Start by adding attendees!
                      </p>
                    ) : (
                      <>
                        {attendees.slice(0, 3).map((attendee) => (
                          <div key={attendee.id} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-safari-green rounded-full" />
                            <span className="text-sm">{attendee.name} joined the trip</span>
                            <Badge variant={attendee.confirmed ? "default" : "secondary"}>
                              {attendee.confirmed ? "Confirmed" : "Pending"}
                            </Badge>
                          </div>
                        ))}
                        {expenses.slice(0, 2).map((expense) => (
                          <div key={expense.id} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-safari-orange rounded-full" />
                            <span className="text-sm">
                              {expense.amount} DH added to {expense.category}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;