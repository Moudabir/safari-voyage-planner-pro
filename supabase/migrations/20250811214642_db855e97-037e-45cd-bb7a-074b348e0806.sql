-- Create a table to support multiple payers per expense
CREATE TABLE IF NOT EXISTS public.expense_payers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL,
  attendee_id UUID NULL,
  payer_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Relationships
ALTER TABLE public.expense_payers
  ADD CONSTRAINT expense_payers_expense_id_fkey
  FOREIGN KEY (expense_id)
  REFERENCES public.expenses(id)
  ON DELETE CASCADE;

ALTER TABLE public.expense_payers
  ADD CONSTRAINT expense_payers_attendee_id_fkey
  FOREIGN KEY (attendee_id)
  REFERENCES public.attendees(id)
  ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_expense_payers_expense_id ON public.expense_payers(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_payers_attendee_id ON public.expense_payers(attendee_id);

-- Enable RLS
ALTER TABLE public.expense_payers ENABLE ROW LEVEL SECURITY;

-- Policies: tie access to the parent expense ownership
CREATE POLICY IF NOT EXISTS "Users can view payers of their expenses"
ON public.expense_payers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_payers.expense_id AND e.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Users can insert payers for their expenses"
ON public.expense_payers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_payers.expense_id AND e.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Users can update payers for their expenses"
ON public.expense_payers
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_payers.expense_id AND e.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Users can delete payers for their expenses"
ON public.expense_payers
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_payers.expense_id AND e.user_id = auth.uid()
  )
);
