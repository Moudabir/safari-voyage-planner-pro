-- Create table for secure guest sharing of trip data
create table if not exists public.trip_shares (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null,
  created_by uuid not null,
  token text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  passcode_hash text,
  can_view_attendees boolean not null default true,
  can_view_expenses boolean not null default true,
  can_view_schedule boolean not null default true
);

-- Enable RLS
alter table public.trip_shares enable row level security;

-- Policies: only owners can manage their shares
create policy "Users can view their own trip shares"
  on public.trip_shares for select
  to authenticated
  using (auth.uid() = created_by);

create policy "Users can create trip shares for their trips"
  on public.trip_shares for insert
  to authenticated
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.trips t
      where t.id = trip_id and t.user_id = auth.uid()
    )
  );

create policy "Users can update their own trip shares"
  on public.trip_shares for update
  to authenticated
  using (auth.uid() = created_by);

create policy "Users can delete their own trip shares"
  on public.trip_shares for delete
  to authenticated
  using (auth.uid() = created_by);

-- Helpful indexes
create index if not exists idx_trip_shares_trip_id on public.trip_shares(trip_id);
create index if not exists idx_trip_shares_created_by on public.trip_shares(created_by);
create index if not exists idx_trip_shares_expires_at on public.trip_shares(expires_at);
