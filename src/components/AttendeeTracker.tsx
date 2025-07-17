import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Trash2, UserPlus, MapPin, MessageCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  confirmed?: boolean;
  pickupLocation?: string;
}

interface AttendeeTrackerProps {
  attendees: Attendee[];
  setAttendees: (attendees: Attendee[]) => void;
  tripId: string;
}

export const AttendeeTracker: React.FC<AttendeeTrackerProps> = ({
  attendees,
  setAttendees,
  tripId
}) => {
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: "",
    email: "",
    phone: "",
    confirmed: false,
    pickupLocation: ""
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (tripId && user) {
      loadAttendees();
    }
  }, [tripId, user]);

  const loadAttendees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedAttendees = data.map(attendee => ({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email || "",
        phone: attendee.phone || "",
        whatsapp: attendee.phone || "",
        confirmed: true, // All stored attendees are confirmed
        pickupLocation: ""
      }));

      setAttendees(formattedAttendees);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load attendees",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendee = async () => {
    if (!newAttendee.name || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendees')
        .insert([
          {
            trip_id: tripId,
            user_id: user.id,
            name: newAttendee.name,
            email: newAttendee.email,
            phone: newAttendee.phone
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newAttendeeFormatted = {
        id: data.id,
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
        whatsapp: data.phone || "",
        confirmed: true,
        pickupLocation: ""
      };

      setAttendees([...attendees, newAttendeeFormatted]);
      setNewAttendee({
        name: "",
        email: "",
        phone: "",
        confirmed: false,
        pickupLocation: ""
      });
      setIsAddingAttendee(false);
      toast({
        title: "Attendee Added",
        description: `${data.name} has been added to the trip.`
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

  const handleDeleteAttendee = async (id: string) => {
    const attendee = attendees.find(a => a.id === id);
    
    try {
      const { error } = await supabase
        .from('attendees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAttendees(attendees.filter(a => a.id !== id));
      toast({
        title: "Attendee Removed",
        description: `${attendee?.name} has been removed from the trip.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove attendee",
        variant: "destructive",
      });
    }
  };

  if (loading && attendees.length === 0) {
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
          <h2 className="text-2xl font-bold text-safari-green">Attendee Tracker</h2>
          <p className="text-muted-foreground">
            Manage who's coming to your trip
          </p>
        </div>
        <Dialog open={isAddingAttendee} onOpenChange={setIsAddingAttendee}>
          <DialogTrigger asChild>
            <Button className="bg-safari-green hover:bg-safari-green/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Attendee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Attendee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter attendee name"
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee({
                    ...newAttendee,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee({
                    ...newAttendee,
                    email: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={newAttendee.phone}
                  onChange={(e) => setNewAttendee({
                    ...newAttendee,
                    phone: e.target.value
                  })}
                />
              </div>
              <Button 
                onClick={handleAddAttendee} 
                className="w-full bg-safari-green hover:bg-safari-green/90"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Attendee"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Attendees List */}
      {attendees.length === 0 ? (
        <Card className="border-safari-sand">
          <CardContent className="py-12">
            <div className="text-center">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No attendees yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your travel group by adding attendees
              </p>
              <Button onClick={() => setIsAddingAttendee(true)} className="bg-safari-green hover:bg-safari-green/90">
                Add First Attendee
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendees.map((attendee) => (
            <Card key={attendee.id} className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{attendee.name}</CardTitle>
                    <Badge variant="default" className="mt-1">
                      <Check className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAttendee(attendee.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attendee.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate">{attendee.email}</span>
                    </div>
                  )}
                  {attendee.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`https://wa.me/${attendee.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-safari-green hover:underline cursor-pointer"
                      >
                        {attendee.phone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {attendees.length > 0 && (
        <Card className="border-safari-sand bg-gradient-to-r from-safari-green/10 to-safari-orange/10">
          <CardHeader>
            <CardTitle className="text-safari-brown">Attendee Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-safari-green">
                  {attendees.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-safari-orange">
                  {attendees.filter(a => a.email).length}
                </div>
                <div className="text-sm text-muted-foreground">With Email</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-safari-brown">
                  {attendees.filter(a => a.phone).length}
                </div>
                <div className="text-sm text-muted-foreground">With Phone</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};