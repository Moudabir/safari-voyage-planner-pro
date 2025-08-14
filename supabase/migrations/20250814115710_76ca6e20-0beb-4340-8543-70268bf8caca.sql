-- Add WhatsApp group link column to trips table
ALTER TABLE public.trips 
ADD COLUMN whatsapp_link TEXT;