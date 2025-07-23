-- Create storage bucket for schedule item pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('schedule-pictures', 'schedule-pictures', true);

-- Create policies for schedule picture uploads
CREATE POLICY "Users can view all schedule pictures" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'schedule-pictures');

CREATE POLICY "Users can upload schedule pictures" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'schedule-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own schedule pictures" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'schedule-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own schedule pictures" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'schedule-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);