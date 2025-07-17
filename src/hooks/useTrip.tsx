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
}

export const useTrip = () => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadOrCreateTrip();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrCreateTrip = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Try to find existing trip
      const { data: trips, error: fetchError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      if (trips && trips.length > 0) {
        setCurrentTrip(trips[0]);
      } else {
        // Create a new trip
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

  return { currentTrip, loading };
};