import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Calendar, Clock, MapPin, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'gathering' | 'activity';
  location: string;
}

interface ScheduleManagerProps {
  schedule: ScheduleItem[];
  setSchedule: (schedule: ScheduleItem[]) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ schedule, setSchedule }) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<{
    title: string;
    time: string;
    date: string;
    type: 'gathering' | 'activity';
    location: string;
  }>({
    title: '',
    time: '',
    date: new Date().toISOString().split('T')[0],
    type: 'activity',
    location: ''
  });
  const { toast } = useToast();

  const handleAddItem = () => {
    if (newItem.title && newItem.time && newItem.date) {
      const item: ScheduleItem = {
        id: Date.now().toString(),
        title: newItem.title,
        time: newItem.time,
        date: newItem.date,
        type: newItem.type,
        location: newItem.location
      };
      setSchedule([...schedule, item]);
      setNewItem({
        title: '',
        time: '',
        date: new Date().toISOString().split('T')[0],
        type: 'activity',
        location: ''
      });
      setIsAddingItem(false);
      toast({
        title: "Schedule Item Added",
        description: `${item.title} has been added to your schedule.`
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = schedule.find(s => s.id === id);
    setSchedule(schedule.filter(s => s.id !== id));
    toast({
      title: "Schedule Item Removed",
      description: `${item?.title} has been removed from your schedule.`
    });
  };

  const sortedSchedule = [...schedule].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingItems = schedule.filter(item => 
    new Date(`${item.date}T${item.time}`) >= new Date()
  );

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const groupedSchedule = sortedSchedule.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-safari-brown">Schedule Manager</h2>
          <p className="text-muted-foreground">
            Plan your gatherings and activities with time management
          </p>
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button className="bg-safari-brown hover:bg-safari-brown/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Schedule Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter activity or gathering title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newItem.type} onValueChange={(value: 'gathering' | 'activity') => 
                  setNewItem({...newItem, type: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gathering">Gathering</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newItem.date}
                    onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem({...newItem, time: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                />
              </div>
              <Button onClick={handleAddItem} className="w-full bg-safari-brown hover:bg-safari-brown/90">
                Add to Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Calendar className="h-4 w-4 text-safari-brown" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safari-brown">{schedule.length}</div>
            <p className="text-xs text-muted-foreground">
              {schedule.filter(s => s.type === 'activity').length} activities, {schedule.filter(s => s.type === 'gathering').length} gatherings
            </p>
          </CardContent>
        </Card>

        <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-safari-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safari-green">{upcomingItems.length}</div>
            <p className="text-xs text-muted-foreground">
              scheduled ahead
            </p>
          </CardContent>
        </Card>

        <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Event</CardTitle>
            <Activity className="h-4 w-4 text-safari-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-safari-orange">
              {upcomingItems.length > 0 ? upcomingItems[0].title : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingItems.length > 0 ? formatTime(upcomingItems[0].time) : 'No upcoming events'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule List */}
      {schedule.length === 0 ? (
        <Card className="border-safari-sand">
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No schedule items yet</h3>
              <p className="text-muted-foreground mb-4">
                Start planning your trip by adding activities and gatherings
              </p>
              <Button 
                onClick={() => setIsAddingItem(true)}
                className="bg-safari-brown hover:bg-safari-brown/90"
              >
                Add First Item
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedule).map(([date, items]) => (
            <Card key={date} className="border-safari-sand">
              <CardHeader>
                <CardTitle className="text-safari-brown">{formatDate(date)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-safari-cream rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <Clock className="h-4 w-4 text-safari-brown mb-1" />
                          <span className="text-sm font-medium">{formatTime(item.time)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant={item.type === 'gathering' ? 'default' : 'secondary'}>
                              {item.type === 'gathering' ? (
                                <>
                                  <Users className="h-3 w-3 mr-1" />
                                  Gathering
                                </>
                              ) : (
                                <>
                                  <Activity className="h-3 w-3 mr-1" />
                                  Activity
                                </>
                              )}
                            </Badge>
                          </div>
                          {item.location && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};