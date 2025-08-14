import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  whatsapp_link?: string;
}

export const useTrip = () => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTrips();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTrips = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load all trips for the user
      const { data: trips, error: fetchError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAllTrips(trips || []);

      if (trips && trips.length > 0) {
        // Set the most recently updated trip as current
        setCurrentTrip(trips[0]);
      } else {
        // Create a new trip if none exist
        const { data: newTrip, error: createError } = await supabase
          .from('trips')
          .insert([
            {
              user_id: user.id,
              name: 'My Safari Trip'
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        setCurrentTrip(newTrip);
        setAllTrips([newTrip]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load trip data",
        variant: "destructive",
      });
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    // Update the trip's updated_at timestamp when selected
    supabase
      .from('trips')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', trip.id)
      .eq('user_id', user?.id)
      .then(() => {
        // Reload trips to get updated order
        loadTrips();
      });
  };

  const refreshTrips = () => {
    loadTrips();
  };

  return { 
    currentTrip, 
    allTrips, 
    loading, 
    selectTrip, 
    refreshTrips 
  };
};