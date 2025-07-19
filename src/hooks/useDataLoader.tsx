
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DataState {
  attendees: any[];
  expenses: any[];
  schedule: any[];
}

export const useDataLoader = (currentTrip: any, user: any, tripLoading: boolean) => {
  const [data, setData] = useState<DataState>({
    attendees: [],
    expenses: [],
    schedule: []
  });
  const [dataLoading, setDataLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const { toast } = useToast();

  const loadData = async () => {
    if (!currentTrip || !user || hasLoadedRef.current) return;

    console.log('Loading trip data...');
    setDataLoading(true);
    
    try {
      const [attendeesData, expensesData, scheduleData] = await Promise.all([
        supabase.from('attendees').select('*').eq('trip_id', currentTrip.id).order('created_at', { ascending: true }),
        supabase.from('expenses').select('*').eq('trip_id', currentTrip.id).order('created_at', { ascending: false }),
        supabase.from('schedule_items').select('*').eq('trip_id', currentTrip.id).order('date', { ascending: true })
      ]);

      const newData: DataState = {
        attendees: attendeesData.data || [],
        expenses: expensesData.data || [],
        schedule: scheduleData.data ? scheduleData.data.map(item => ({
          id: item.id,
          title: item.title,
          time: item.time || '',
          date: item.date,
          type: 'activity' as 'gathering' | 'activity',
          location: item.description || '',
          pictures: item.pictures || []
        })) : []
      };

      setData(newData);
      hasLoadedRef.current = true;
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load trip data",
        variant: "destructive"
      });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (currentTrip && user && !tripLoading && !hasLoadedRef.current) {
      loadData();
    }
  }, [currentTrip, user, tripLoading]);

  const updateAttendees = (newAttendees: any[]) => {
    setData(prev => ({ ...prev, attendees: newAttendees }));
  };

  const updateExpenses = (newExpenses: any[]) => {
    setData(prev => ({ ...prev, expenses: newExpenses }));
  };

  const updateSchedule = (newSchedule: any[]) => {
    setData(prev => ({ ...prev, schedule: newSchedule }));
  };

  return {
    ...data,
    dataLoading,
    updateAttendees,
    updateExpenses,
    updateSchedule
  };
};
