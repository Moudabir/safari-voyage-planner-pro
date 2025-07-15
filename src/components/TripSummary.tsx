import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, Calendar, MapPin, Clock, Activity, Check, X, Home, Car, UtensilsCrossed, AlertTriangle } from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  email: string;
  confirmed: boolean;
  pickupLocation: string;
}

interface Expense {
  id: string;
  category: 'stay' | 'transport' | 'food' | 'emergency';
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
}

interface TripSummaryProps {
  attendees: Attendee[];
  expenses: Expense[];
  schedule: ScheduleItem[];
}

const categoryIcons = {
  stay: Home,
  transport: Car,
  food: UtensilsCrossed,
  emergency: AlertTriangle
};

export const TripSummary: React.FC<TripSummaryProps> = ({ attendees, expenses, schedule }) => {
  const confirmedAttendees = attendees.filter(a => a.confirmed);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const upcomingActivities = schedule.filter(item => new Date(`${item.date}T${item.time}`) >= new Date());
  
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const nextActivity = upcomingActivities.sort((a, b) => 
    new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  )[0];

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const tripProgress = () => {
    let score = 0;
    if (attendees.length > 0) score += 25;
    if (confirmedAttendees.length > 0) score += 25;
    if (expenses.length > 0) score += 25;
    if (schedule.length > 0) score += 25;
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-safari-green mb-2">Trip Summary</h2>
        <p className="text-muted-foreground">
          Complete overview of your safari adventure
        </p>
      </div>

      {/* Trip Progress */}
      <Card className="border-safari-sand bg-gradient-to-r from-safari-green/10 to-safari-orange/10">
        <CardHeader>
          <CardTitle className="text-safari-brown">Trip Planning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{tripProgress()}%</span>
            </div>
            <Progress value={tripProgress()} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-safari-green">
                  {attendees.length > 0 ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-safari-orange">
                  {confirmedAttendees.length > 0 ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-safari-brown">
                  {expenses.length > 0 ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Expenses</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {schedule.length > 0 ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Schedule</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendees Summary */}
        <Card className="border-safari-sand">
          <CardHeader>
            <CardTitle className="text-safari-green flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Attendees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendees.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No attendees added yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold">{attendees.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmed:</span>
                  <span className="font-bold text-safari-green">{confirmedAttendees.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-bold text-safari-orange">{attendees.length - confirmedAttendees.length}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {attendees.slice(0, 3).map((attendee) => (
                    <div key={attendee.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{attendee.name}</span>
                      <Badge variant={attendee.confirmed ? "default" : "secondary"} className="ml-2">
                        {attendee.confirmed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </Badge>
                    </div>
                  ))}
                  {attendees.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{attendees.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses Summary */}
        <Card className="border-safari-sand">
          <CardHeader>
            <CardTitle className="text-safari-orange flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No expenses tracked yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold text-safari-orange">${totalExpenses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transactions:</span>
                  <span className="font-bold">{expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average:</span>
                  <span className="font-bold">${(totalExpenses / expenses.length).toFixed(2)}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {Object.entries(expensesByCategory).map(([category, amount]) => {
                    const Icon = categoryIcons[category as keyof typeof categoryIcons];
                    return (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Icon className="h-3 w-3 mr-1" />
                          <span className="capitalize">{category}</span>
                        </div>
                        <span className="font-medium">${amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Summary */}
        <Card className="border-safari-sand">
          <CardHeader>
            <CardTitle className="text-safari-brown flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No schedule items yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-bold">{schedule.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Upcoming:</span>
                  <span className="font-bold text-safari-green">{upcomingActivities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities:</span>
                  <span className="font-bold">{schedule.filter(s => s.type === 'activity').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gatherings:</span>
                  <span className="font-bold">{schedule.filter(s => s.type === 'gathering').length}</span>
                </div>
                {nextActivity && (
                  <div className="mt-4 p-3 bg-safari-cream rounded-lg">
                    <div className="text-sm font-medium text-safari-brown mb-1">Next Event:</div>
                    <div className="text-sm">{nextActivity.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(nextActivity.date)} at {formatTime(nextActivity.time)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-safari-sand">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-safari-cream rounded-lg">
              <Users className="h-8 w-8 mx-auto text-safari-green mb-2" />
              <p className="text-sm font-medium mb-1">Manage Attendees</p>
              <p className="text-xs text-muted-foreground">Add, confirm, or remove attendees</p>
            </div>
            <div className="text-center p-4 bg-safari-cream rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto text-safari-orange mb-2" />
              <p className="text-sm font-medium mb-1">Track Expenses</p>
              <p className="text-xs text-muted-foreground">Add expenses by category</p>
            </div>
            <div className="text-center p-4 bg-safari-cream rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-safari-brown mb-2" />
              <p className="text-sm font-medium mb-1">Plan Schedule</p>
              <p className="text-xs text-muted-foreground">Add activities and gatherings</p>
            </div>
            <div className="text-center p-4 bg-safari-cream rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium mb-1">View Overview</p>
              <p className="text-xs text-muted-foreground">See detailed progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Message */}
      <Card className="border-safari-sand bg-gradient-to-r from-safari-green/5 to-safari-orange/5">
        <CardContent className="pt-6">
          <div className="text-center">
            {tripProgress() === 100 ? (
              <div>
                <div className="text-2xl mb-2">🎉</div>
                <h3 className="text-lg font-bold text-safari-green mb-2">Ready for Adventure!</h3>
                <p className="text-muted-foreground">
                  Your safari trip is fully planned and ready to go. Have an amazing time!
                </p>
              </div>
            ) : tripProgress() >= 75 ? (
              <div>
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-lg font-bold text-safari-orange mb-2">Almost There!</h3>
                <p className="text-muted-foreground">
                  Your trip is well planned. Just a few more details to finalize.
                </p>
              </div>
            ) : tripProgress() >= 50 ? (
              <div>
                <div className="text-2xl mb-2">📝</div>
                <h3 className="text-lg font-bold text-safari-brown mb-2">Good Progress!</h3>
                <p className="text-muted-foreground">
                  You're making good progress on planning your safari trip.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2">🌟</div>
                <h3 className="text-lg font-bold text-primary mb-2">Let's Start Planning!</h3>
                <p className="text-muted-foreground">
                  Begin by adding attendees, then track expenses and create your schedule.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};