import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Trash2, UserPlus, MapPin, Mail, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface Attendee {
  id: string;
  name: string;
  email: string;
  confirmed: boolean;
  pickupLocation: string;
}
interface AttendeeTrackerProps {
  attendees: Attendee[];
  setAttendees: (attendees: Attendee[]) => void;
}
export const AttendeeTracker: React.FC<AttendeeTrackerProps> = ({
  attendees,
  setAttendees
}) => {
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: "",
    email: "",
    confirmed: false,
    pickupLocation: ""
  });
  const {
    toast
  } = useToast();
  const handleAddAttendee = () => {
    if (newAttendee.name && newAttendee.email) {
      const attendee: Attendee = {
        id: Date.now().toString(),
        ...newAttendee
      };
      setAttendees([...attendees, attendee]);
      setNewAttendee({
        name: "",
        email: "",
        confirmed: false,
        pickupLocation: ""
      });
      setIsAddingAttendee(false);
      toast({
        title: "Attendee Added",
        description: `${attendee.name} has been added to the trip.`
      });
    }
  };
  const handleDeleteAttendee = (id: string) => {
    const attendee = attendees.find(a => a.id === id);
    setAttendees(attendees.filter(a => a.id !== id));
    toast({
      title: "Attendee Removed",
      description: `${attendee?.name} has been removed from the trip.`
    });
  };
  const handleToggleConfirmation = (id: string) => {
    const updatedAttendees = attendees.map(attendee => attendee.id === id ? {
      ...attendee,
      confirmed: !attendee.confirmed
    } : attendee);
    setAttendees(updatedAttendees);
    const attendee = updatedAttendees.find(a => a.id === id);
    toast({
      title: attendee?.confirmed ? "Attendee Confirmed" : "Confirmation Removed",
      description: `${attendee?.name} ${attendee?.confirmed ? "confirmed" : "unconfirmed"} their attendance.`
    });
  };
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-safari-green">Attendee Tracker</h2>
          <p className="text-muted-foreground">
            Manage who's coming and track confirmations
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
                <Input id="name" placeholder="Enter attendee name" value={newAttendee.name} onChange={e => setNewAttendee({
                ...newAttendee,
                name: e.target.value
              })} />
              </div>
              <div>
                <Label htmlFor="email">Contact</Label>
                <Input id="email" type="email" placeholder="Enter email address" value={newAttendee.email} onChange={e => setNewAttendee({
                ...newAttendee,
                email: e.target.value
              })} />
              </div>
              <div>
                <Label htmlFor="pickup">Pickup Location</Label>
                <Input id="pickup" placeholder="Enter pickup location" value={newAttendee.pickupLocation} onChange={e => setNewAttendee({
                ...newAttendee,
                pickupLocation: e.target.value
              })} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="confirmed" checked={newAttendee.confirmed} onCheckedChange={checked => setNewAttendee({
                ...newAttendee,
                confirmed: checked
              })} />
                <Label htmlFor="confirmed">Pre-confirmed</Label>
              </div>
              <Button onClick={handleAddAttendee} className="w-full bg-safari-green hover:bg-safari-green/90">
                Add Attendee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Attendees List */}
      {attendees.length === 0 ? <Card className="border-safari-sand">
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
        </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendees.map(attendee => <Card key={attendee.id} className="border-safari-sand bg-gradient-to-br from-card to-safari-cream">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{attendee.name}</CardTitle>
                    <Badge variant={attendee.confirmed ? "default" : "secondary"} className="mt-1">
                      {attendee.confirmed ? <>
                          <Check className="h-3 w-3 mr-1" />
                          Confirmed
                        </> : <>
                          <X className="h-3 w-3 mr-1" />
                          Pending
                        </>}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAttendee(attendee.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{attendee.email}</span>
                  </div>
                  {attendee.pickupLocation && <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{attendee.pickupLocation}</span>
                    </div>}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confirmed</span>
                    <Switch checked={attendee.confirmed} onCheckedChange={() => handleToggleConfirmation(attendee.id)} />
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>}

      {/* Summary Stats */}
      {attendees.length > 0 && <Card className="border-safari-sand bg-gradient-to-r from-safari-green/10 to-safari-orange/10">
          <CardHeader>
            <CardTitle className="text-safari-brown">Attendee Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-safari-green">
                  {attendees.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-safari-orange">
                  {attendees.filter(a => a.confirmed).length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-safari-brown">
                  {attendees.filter(a => !a.confirmed).length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {attendees.filter(a => a.pickupLocation).length}
                </div>
                <div className="text-sm text-muted-foreground">With Pickup</div>
              </div>
            </div>
          </CardContent>
        </Card>}
    </div>;
};