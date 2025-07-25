import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar, Trash2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trip } from "@/hooks/useTrip";
interface TripSelectorProps {
  trips: Trip[];
  currentTrip: Trip | null;
  onTripSelect: (trip: Trip) => void;
  onTripsUpdate: () => void;
}
export const TripSelector = ({
  trips,
  currentTrip,
  onTripSelect,
  onTripsUpdate
}: TripSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTripName, setNewTripName] = useState("");
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editTripName, setEditTripName] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const createTrip = async () => {
    if (!user || !newTripName.trim()) return;
    setLoading(true);
    try {
      const {
        data: newTrip,
        error
      } = await supabase.from('trips').insert([{
        user_id: user.id,
        name: newTripName.trim()
      }]).select().single();
      if (error) throw error;
      setNewTripName("");
      setIsCreating(false);
      onTripsUpdate();
      onTripSelect(newTrip);
      toast({
        title: "Trip Created",
        description: `${newTrip.name} has been created successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create trip",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const updateTrip = async (tripId: string, newName: string) => {
    if (!user || !newName.trim()) return;
    try {
      const {
        error
      } = await supabase.from('trips').update({
        name: newName.trim()
      }).eq('id', tripId).eq('user_id', user.id);
      if (error) throw error;
      setEditingTripId(null);
      setEditTripName("");
      onTripsUpdate();
      toast({
        title: "Trip Updated",
        description: `Trip name updated to "${newName}".`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update trip",
        variant: "destructive"
      });
    }
  };
  const startEditing = (trip: Trip) => {
    setEditingTripId(trip.id);
    setEditTripName(trip.name);
  };
  const cancelEditing = () => {
    setEditingTripId(null);
    setEditTripName("");
  };
  const deleteTrip = async (tripId: string, tripName: string) => {
    if (!user) return;
    try {
      const {
        error
      } = await supabase.from('trips').delete().eq('id', tripId).eq('user_id', user.id);
      if (error) throw error;
      onTripsUpdate();
      toast({
        title: "Trip Deleted",
        description: `${tripName} has been deleted.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive"
      });
    }
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white text-safari-green hover:bg-white/90 font-semibold">
          <MapPin className="h-4 w-4 mr-2" />
          {currentTrip?.name || "Select Trip"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Your Trips</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Create New Trip */}
          {isCreating ? <Card className="border-dashed border-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trip-name">Trip Name</Label>
                    <Input id="trip-name" placeholder="Enter trip name..." value={newTripName} onChange={e => setNewTripName(e.target.value)} onKeyPress={e => e.key === 'Enter' && createTrip()} />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={createTrip} disabled={loading || !newTripName.trim()}>
                      {loading ? "Creating..." : "Create Trip"}
                    </Button>
                    <Button variant="outline" onClick={() => {
                  setIsCreating(false);
                  setNewTripName("");
                }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card> : <Button onClick={() => setIsCreating(true)} className="w-full border-dashed border-2 border-muted-foreground/25 bg-muted/50 hover:bg-muted" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Trip
            </Button>}

          {/* Trip List */}
          <div className="space-y-3">
            {trips.map(trip => <Card key={trip.id} className={`transition-all hover:shadow-md ${currentTrip?.id === trip.id ? 'ring-2 ring-primary bg-primary/5' : ''} ${editingTripId === trip.id ? '' : 'cursor-pointer'}`} onClick={() => {
            if (editingTripId !== trip.id) {
              onTripSelect(trip);
              setIsOpen(false);
            }
          }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    {editingTripId === trip.id ? <div className="flex items-center space-x-2 flex-1">
                        <Input value={editTripName} onChange={e => setEditTripName(e.target.value)} onKeyPress={e => {
                    if (e.key === 'Enter') {
                      updateTrip(trip.id, editTripName);
                    } else if (e.key === 'Escape') {
                      cancelEditing();
                    }
                  }} className="text-lg font-semibold" autoFocus />
                        <Button variant="ghost" size="sm" onClick={() => updateTrip(trip.id, editTripName)} className="h-8 w-8 p-0 text-green-600 hover:text-green-600 hover:bg-green-100">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-8 w-8 p-0 text-gray-500 hover:text-gray-500 hover:bg-gray-100">
                          <X className="h-4 w-4" />
                        </Button>
                      </div> : <>
                        <CardTitle className="text-lg">{trip.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {currentTrip?.id === trip.id && <Badge variant="default">Current</Badge>}
                          <Button variant="ghost" size="sm" onClick={e => {
                      e.stopPropagation();
                      startEditing(trip);
                    }} className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600 hover:bg-blue-100">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={e => {
                      e.stopPropagation();
                      deleteTrip(trip.id, trip.name);
                    }} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created {new Date(trip.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {trips.length === 0 && !isCreating && <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trips found. Create your first trip to get started!</p>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};