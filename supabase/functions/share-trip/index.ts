import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShareRequestBody {
  token: string;
  passcode?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, passcode }: ShareRequestBody = await req.json();

    if (!token || token.length < 16) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1) Verify share token
    const { data: share, error: shareError } = await supabase
      .from("trip_shares")
      .select("trip_id, expires_at, revoked_at, passcode_hash, can_view_attendees, can_view_expenses, can_view_schedule")
      .eq("token", token)
      .maybeSingle();

    if (shareError) throw shareError;
    if (!share) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (share.revoked_at || (share.expires_at && new Date(share.expires_at) < new Date())) {
      return new Response(JSON.stringify({ error: "Link expired or revoked" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (share.passcode_hash && (!passcode || passcode !== share.passcode_hash)) {
      return new Response(JSON.stringify({ error: "Invalid passcode" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const tripId = share.trip_id as string;

    // 2) Load data with service role (bypasses RLS safely in function)
    const [attendeesRes, expensesRes, scheduleRes] = await Promise.all([
      share.can_view_attendees
        ? supabase.from("attendees").select("id, name").eq("trip_id", tripId)
        : Promise.resolve({ data: [], error: null }),
      share.can_view_expenses
        ? supabase.from("expenses").select("id, description, amount, category, paid_by, created_at").eq("trip_id", tripId).order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      share.can_view_schedule
        ? supabase.from("schedule_items").select("id, title, date, time").eq("trip_id", tripId).order("date", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ]);

    const anyError = attendeesRes.error || expensesRes.error || scheduleRes.error;
    if (anyError) throw anyError;

    const payload = {
      tripId,
      attendees: attendeesRes.data || [],
      expenses: expensesRes.data || [],
      schedule: scheduleRes.data || [],
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("share-trip error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
