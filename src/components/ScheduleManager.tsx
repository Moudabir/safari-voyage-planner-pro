import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Calendar, Clock, MapPin, Users, Activity, Camera, Image, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'gathering' | 'activity';
  location: string;
  pictures: string[];
}

interface ScheduleManagerProps {
  schedule: ScheduleItem[];
  setSchedule: (schedule: ScheduleItem[]) => void;
  tripId: string;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ 
  schedule, 
  setSchedule, 
  tripId 
}) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [isManagingPictures, setIsManagingPictures] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [editForm, setEditForm] = useState<{
    title: string;
    time: string;
    date: string;
    type: 'gathering' | 'activity';
    location: string;
  }>({
    title: '',
    time: '',
    date: '',
    type: 'activity',
    location: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (tripId && user) {
      loadSchedule();
    }
  }, [tripId, user]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedSchedule = data.map(item => ({
        id: item.id,
        title: item.title,
        time: item.time || '',
        date: item.date,
        type: 'activity' as 'gathering' | 'activity', // Default to activity
        location: item.description || '',
        pictures: item.pictures || []
      }));

      setSchedule(formattedSchedule);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.time || !newItem.date || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_items')
        .insert([
          {
            trip_id: tripId,
            user_id: user.id,
            title: newItem.title,
            date: newItem.date,
            time: newItem.time,
            description: newItem.location,
            pictures: []
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newScheduleItem = {
        id: data.id,
        title: data.title,
        time: data.time || '',
        date: data.date,
        type: newItem.type,
        location: data.description || '',
        pictures: data.pictures || []
      };

      setSchedule([...schedule, newScheduleItem]);
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
        description: `${data.title} has been added to your schedule.`
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

  const handleDeleteItem = async (id: string) => {
    const item = schedule.find(s => s.id === id);
    
    try {
      const { error } = await supabase
        .from('schedule_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSchedule(schedule.filter(s => s.id !== id));
      toast({
        title: "Schedule Item Removed",
        description: `${item?.title} has been removed from your schedule.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove schedule item",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      time: item.time,
      date: item.date,
      type: item.type,
      location: item.location
    });
    setIsEditingItem(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editForm.title || !editForm.time || !editForm.date || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_items')
        .update({
          title: editForm.title,
          date: editForm.date,
          time: editForm.time,
          description: editForm.location
        })
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) throw error;

      const updatedItem = {
        id: data.id,
        title: data.title,
        time: data.time || '',
        date: data.date,
        type: editForm.type,
        location: data.description || '',
        pictures: data.pictures || []
      };

      setSchedule(schedule.map(s => s.id === editingItem.id ? updatedItem : s));
      setIsEditingItem(false);
      setEditingItem(null);
      toast({
        title: "Schedule Item Updated",
        description: `${data.title} has been updated successfully.`
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

  const handleAddPicture = async (itemId: string, pictureUrl: string) => {
    try {
      const item = schedule.find(s => s.id === itemId);
      if (!item) return;

      const updatedPictures = [...(item.pictures || []), pictureUrl];
      
      const { error } = await supabase
        .from('schedule_items')
        .update({ pictures: updatedPictures })
        .eq('id', itemId);

      if (error) throw error;

      const updatedSchedule = schedule.map(scheduleItem => 
        scheduleItem.id === itemId 
          ? { ...scheduleItem, pictures: updatedPictures }
          : scheduleItem
      );
      setSchedule(updatedSchedule);
      toast({
        title: "Picture Added",
        description: "Picture has been added to the schedule item."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add picture",
        variant: "destructive",
      });
    }
  };

  const handleRemovePicture = async (itemId: string, pictureIndex: number) => {
    try {
      const item = schedule.find(s => s.id === itemId);
      if (!item) return;

      const updatedPictures = item.pictures?.filter((_, index) => index !== pictureIndex) || [];
      
      const { error } = await supabase
        .from('schedule_items')
        .update({ pictures: updatedPictures })
        .eq('id', itemId);

      if (error) throw error;

      const updatedSchedule = schedule.map(scheduleItem => 
        scheduleItem.id === itemId 
          ? { ...scheduleItem, pictures: updatedPictures }
          : scheduleItem
      );
      setSchedule(updatedSchedule);
      toast({
        title: "Picture Removed",
        description: "Picture has been removed from the schedule item."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove picture",
        variant: "destructive",
      });
    }
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
    if (!time) return '';
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

  if (loading && schedule.length === 0) {
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
          <h2 className="text-xl md:text-2xl font-bold text-safari-brown">Schedule Manager</h2>
          <p className="text-sm md:text-base text-muted-foreground">
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
              <Button 
                onClick={handleAddItem} 
                className="w-full bg-safari-brown hover:bg-safari-brown/90"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add to Schedule"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
                    <div key={item.id} className="p-4 bg-safari-cream rounded-lg">
                       <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                         <div className="flex items-center space-x-3 md:space-x-4">
                           <div className="flex flex-col items-center">
                             <Clock className="h-4 w-4 text-safari-brown mb-1" />
                             <span className="text-sm font-medium">{formatTime(item.time)}</span>
                           </div>
                           <div className="flex-1">
                             <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2 mb-1">
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
                                 <span className="truncate">{item.location}</span>
                               </div>
                             )}
                           </div>
                         </div>
                          <div className="flex items-center space-x-2 self-end md:self-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(item)}
                              className="text-safari-brown hover:text-safari-brown hover:bg-safari-brown/10"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsManagingPictures(true);
                              }}
                              className="text-safari-green hover:text-safari-green hover:bg-safari-green/10"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                       </div>
                      {item.pictures && item.pictures.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center space-x-2 mb-2">
                            <Image className="h-4 w-4 text-safari-green" />
                            <span className="text-sm font-medium">Pictures ({item.pictures.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.pictures.slice(0, 3).map((picture, index) => (
                              <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-safari-sand">
                                <img 
                                  src={picture} 
                                  alt={`${item.title} picture ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {item.pictures.length > 3 && (
                              <div className="w-16 h-16 rounded-lg bg-safari-sand flex items-center justify-center">
                                <span className="text-xs text-safari-brown font-medium">+{item.pictures.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Picture Management Dialog */}
      <Dialog open={isManagingPictures} onOpenChange={setIsManagingPictures}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Pictures - {selectedItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="picture-url">Add Picture URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="picture-url"
                  placeholder="Enter image URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && selectedItem) {
                      const url = (e.target as HTMLInputElement).value;
                      if (url) {
                        handleAddPicture(selectedItem.id, url);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('picture-url') as HTMLInputElement;
                    if (input.value && selectedItem) {
                      handleAddPicture(selectedItem.id, input.value);
                      input.value = '';
                    }
                  }}
                  className="bg-safari-green hover:bg-safari-green/90"
                >
                  Add
                </Button>
              </div>
            </div>
            
            {selectedItem?.pictures && selectedItem.pictures.length > 0 && (
              <div>
                <Label>Current Pictures</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {selectedItem.pictures.map((picture, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={picture} 
                        alt={`${selectedItem.title} picture ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => handleRemovePicture(selectedItem.id, index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Item Dialog */}
      <Dialog open={isEditingItem} onOpenChange={setIsEditingItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter activity or gathering title"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select value={editForm.type} onValueChange={(value: 'gathering' | 'activity') => 
                setEditForm({...editForm, type: value})
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
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                placeholder="Enter location"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
              />
            </div>
            <Button 
              onClick={handleUpdateItem} 
              className="w-full bg-safari-brown hover:bg-safari-brown/90"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Schedule Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};